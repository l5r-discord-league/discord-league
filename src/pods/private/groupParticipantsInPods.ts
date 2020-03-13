import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { ordNumber, contramap, ordBoolean } from 'fp-ts/lib/Ord'
import { fst } from 'fp-ts/lib/ReadonlyTuple'
import { flow } from 'fp-ts/lib/function'

import { ParticipantRecord } from '../../gateways/storage'

const POD_SIZE = 8
const MIN_FOR_ALLOC = 2 * POD_SIZE

type Participant = ParticipantRecord
interface Cohort {
  tz: number
  fixed: Participant[]
  fluid: Participant[]
}
export type Pod = Participant[]
interface BetterPod {
  timezoneId: number
  participants: Participant[]
}

const cohortSize = (coh: Cohort): number => coh.fixed.length + coh.fluid.length

const groupInCohorts: (parts: Participant[]) => Cohort[] = flow(
  A.sort(contramap((part: Participant) => part.timezoneId)(ordNumber)),
  A.chop(parts => {
    const { init, rest } = A.spanLeft<Participant>(p => p.timezoneId === parts[0].timezoneId)(parts)
    return [init, rest]
  }),
  A.map(A.partition(part => part.timezonePreferenceId === 'similar')),
  A.map(({ right: fixed, left: fluid }) => ({ fixed, fluid, tz: fixed[0].timezoneId }))
)

const canBeDecomposedIn7sAnd8s = (n: number) => {
  if (n >= 42) {
    return true
  }

  for (let x = 0, topX = Math.floor(n / 8); x <= topX; x++) {
    for (let y = 0, topY = Math.floor(n / 7); y <= topY; y++) {
      if (n === 8 * x + 7 * y) {
        return true
      }
    }
  }

  return false
}

const indexOfShortGroup: (cohs: Cohort[]) => number | null = flow(
  A.filterMapWithIndex((...args) =>
    O.fromPredicate(([, g]) => cohortSize(g) < MIN_FOR_ALLOC)(args)
  ),
  A.head,
  O.map(fst),
  O.toNullable
)

const isCohortReady = (coh: Cohort) =>
  canBeDecomposedIn7sAnd8s(cohortSize(coh)) && cohortSize(coh) >= MIN_FOR_ALLOC

const adjustCohorts = (cohs: Cohort[]): Cohort[] => {
  if (cohs.every(isCohortReady)) {
    return cohs
  }

  const idxToFix = indexOfShortGroup(cohs)
  if (idxToFix === null) {
    throw Error('No short group and not ready')
  }

  const receiver = O.toNullable(A.lookup(idxToFix, cohs))
  if (!receiver) {
    throw Error('Unexpected error')
  }

  const needs = MIN_FOR_ALLOC - cohortSize(receiver)

  const otherGroups = A.unsafeDeleteAt(idxToFix, cohs)
  const prioritizedDonors = A.sortBy([
    contramap((coh: Cohort) => cohortSize(coh) - needs < MIN_FOR_ALLOC)(ordBoolean), // TRUE COMES LAST
    contramap((coh: Cohort) => Math.abs(coh.tz - receiver.tz))(ordNumber),
    contramap((coh: Cohort) => -coh.fluid.length)(ordNumber),
  ])(otherGroups)
  const donor = O.toNullable(A.findFirst<Cohort>(coh => coh.fluid.length > 0)(prioritizedDonors))
  if (!donor) {
    throw Error('No donor possible and not ready')
  }

  receiver.fixed = [...receiver.fixed, ...receiver.fluid, ...A.takeLeft(needs)(donor.fluid)]
  receiver.fluid = []

  donor.fluid = A.dropLeft(needs)(donor.fluid)
  return adjustCohorts(cohs)
}

const createEmptyPods = (parts: Participant[]) =>
  A.makeBy<Participant[]>(Math.ceil(parts.length / 8), () => [])
const distributeClansInPods = (idx: number, pods: Pod[], part: Participant) => {
  pods[idx % pods.length].push(part)
  return pods
}
const cohortToPods = (coh: Cohort) => {
  const perClan = A.sort(contramap((part: Participant) => part.clanId)(ordNumber))([
    ...coh.fixed,
    ...coh.fluid,
  ])
  return A.reduceWithIndex(createEmptyPods(perClan), distributeClansInPods)(perClan)
}

const process: (parts: Participant[]) => BetterPod[] = flow(
  groupInCohorts,
  adjustCohorts,
  A.map(cohortToPods),
  A.chain(
    A.filterMap((pod: Pod) =>
      O.map((part: Participant) => ({ timezoneId: part.timezoneId, participants: pod }))(
        A.findFirst((part: Participant) => part.timezonePreferenceId === 'similar')(pod)
      )
    )
  )
)

export function groupParticipantsInPods(parts: Participant[]): BetterPod[] {
  if (!canBeDecomposedIn7sAnd8s(parts.length)) {
    throw Error('Unsupported tournament size')
  }

  return process(parts)
}
