import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { ordNumber, contramap, ordBoolean } from 'fp-ts/lib/Ord'
import { fst } from 'fp-ts/lib/ReadonlyTuple'
import { flow } from 'fp-ts/lib/function'
import { Semigroup } from 'fp-ts/lib/Semigroup'

// The idea pod size
const POD_SIZE = 8
/**
 * The minimum Cohort size to be considered ready to distribute in pods. Having it as 2 * pod size
 * helps with keeping an acceptable clan distribution, as a 1 * pod size could form very unbalanced
 * groups in regards to clans
 */
const MIN_FOR_ALLOC = 2 * POD_SIZE

/**
 * Checks if a number can be split in parts sized 7 or 8. This is used to determine if a cohort size
 * is compatible with being split in pods or not
 */
const compatibleCohortSmallSizes = [
  7,
  8,
  14,
  15,
  16,
  21,
  22,
  23,
  24,
  28,
  29,
  30,
  31,
  32,
  35,
  36,
  37,
  38,
  39,
  40,
]
const canBeDecomposedIn7sAnd8s = (n: number) => n >= 42 || compatibleCohortSmallSizes.includes(n)

const cohortSize = (coh: Cohort): number => coh.fixed.length + coh.fluid.length

/**
 * Finds the index of a cohort that is below the minimum size
 */
const indexOfShortCohort: (cohs: Cohort[]) => number | null = flow(
  A.filterMapWithIndex((...args) =>
    O.fromPredicate(([, coh]) => cohortSize(coh) < MIN_FOR_ALLOC)(args)
  ),
  A.head,
  O.map(fst),
  O.toNullable
)

/**
 * Is it ready to be decomposed into pods?
 */
const isCohortReady = (coh: Cohort) =>
  canBeDecomposedIn7sAnd8s(cohortSize(coh)) && cohortSize(coh) >= MIN_FOR_ALLOC

function splitReceiverFromOthers(cohs: Cohort[], receiverIdx: number): [Cohort, Cohort[]] {
  // eslint-disable-next-line security/detect-object-injection
  const receiver = cohs[receiverIdx]
  const otherGroups = A.unsafeDeleteAt(receiverIdx, cohs)
  return [receiver, otherGroups]
}
/**
 * Adjust the cohorts trying to make all of them ready to be distributed into pods
 * This function will be called recursivelly until it works.
 * There's a chance of it running forever without ever finding the balance, that is unlikely, but
 * possible in the current implementation. In that case we're gonna get an error when the stack
 * overflows
 */
const adjustCohorts = (cohs: Cohort[]): Cohort[] => {
  if (cohs.every(isCohortReady)) {
    // It is balanced, return
    return cohs
  }
  const idxToFix = indexOfShortCohort(cohs)
  if (idxToFix === null) {
    const { left: incompatibleSize, right: compatibleSize } = A.partition<Cohort>(coh =>
      canBeDecomposedIn7sAnd8s(cohortSize(coh))
    )(cohs)
    console.log({ incompatibleSize, compatibleSize })

    const subject = O.toNullable(A.head(incompatibleSize))
    if (subject == null) {
      throw Error('No idea what is happening')
    }

    const xyz = flow(
      A.spanLeft<number>(n => n < cohortSize(subject)),
      ({ init, rest }) => [A.last(init), A.head(rest)]
    )(compatibleCohortSmallSizes)

    console.log(xyz)

    console.log(
      cohs.map(c => {
        const size = cohortSize(c)
        return {
          size,
          decomposable: canBeDecomposedIn7sAnd8s(size),
          decomposablePlus1: canBeDecomposedIn7sAnd8s(size + 1),
          decomposableMinus1: canBeDecomposedIn7sAnd8s(size - 1),
        }
      })
    )
    // Some cohort might be of an incompatible size
    throw Error('No short group and not ready')
  }

  const [receiver, otherGroups] = splitReceiverFromOthers(cohs, idxToFix)
  const donorsNeeded = MIN_FOR_ALLOC - cohortSize(receiver)
  const prioritizedDonors = A.sortBy([
    contramap((coh: Cohort) => cohortSize(coh) - donorsNeeded < MIN_FOR_ALLOC)(ordBoolean), // TRUE COMES LAST
    contramap((coh: Cohort) => Math.abs(coh.tz - receiver.tz))(ordNumber),
    contramap((coh: Cohort) => -coh.fluid.length)(ordNumber),
  ])(otherGroups)
  const donor = O.toNullable(A.findFirst<Cohort>(coh => coh.fluid.length > 0)(prioritizedDonors))
  if (!donor) {
    // This is possible with weird player combinations, but it's not covered by the current implementation.
    throw Error('No donor possible and not ready')
  }

  /**
   * Turn all the participants in the receiver into fixed participants, and also add the donated participants to the fixed
   */
  receiver.fixed = [...receiver.fixed, ...receiver.fluid, ...A.takeLeft(donorsNeeded)(donor.fluid)]
  receiver.fluid = []

  /**
   * Remove the donated participants from the donor
   */
  donor.fluid = A.dropLeft(donorsNeeded)(donor.fluid)

  // Run again, recursively. Hopefuly it's gonna be balance this time
  return adjustCohorts(cohs)
}

/**
 * Create the correct amount of empty pods for that amount of participants
 */
const createEmptyPods = (timezoneId: number, us: Unit[]) =>
  A.makeBy(Math.ceil(us.length / 8), () => ({ timezoneId, participants: [] }))

const distributeClansInPods = (idx: number, pods: Pod[], u: Unit) => {
  pods[idx % pods.length].participants.push(u)
  return pods
}

/**
 * First we sort by clan, then we distribute them into pods according to the modulo of dividing
 * it's index with the pod count.
 *
 * Using single number for shortness (15 numbers)
 *
 * 1) [1, 4, 1, 2, 3, 4, 1, 2, 5, 6, 7, 7, 7, 6, 3 ] // input
 * 2) [1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 7] // sorted
 * 3) [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0] // modulo 2
 * 4) [1, 1, 2, 3, 4, 6, 7, 7] & [1, 2, 3, 4, 5, 6, 7] // Grouped
 */
const cohortToPods = (coh: Cohort) => {
  const perClan = A.sort(contramap((u: Unit) => u.clan)(ordNumber))([...coh.fixed, ...coh.fluid])
  return A.reduceWithIndex(createEmptyPods(coh.tz, perClan), distributeClansInPods)(perClan)
}

function areThereEnoughFluidParticipants(cohs: Cohort[]): boolean {
  const total = cohs.reduce(
    (total, coh) => {
      const donorsNeeded = MIN_FOR_ALLOC - cohortSize(coh)
      if (donorsNeeded > 0) {
        total.donorsNeeded = total.donorsNeeded + donorsNeeded
      } else {
        total.donorsAvailable =
          total.donorsAvailable + (coh.fluid.length - Math.max(0, MIN_FOR_ALLOC - coh.fixed.length))
      }
      return total
    },
    { donorsNeeded: 0, donorsAvailable: 0 }
  )
  return total.donorsAvailable >= total.donorsNeeded
}

interface ParticipantMin {
  clanId: number
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
}
interface Unit {
  readonly clan: number
  readonly tz: number
  readonly tzPref: 'similar' | 'neutral' | 'dissimilar'
}
class ParticipantUnit<P extends ParticipantMin> implements Unit {
  constructor(public readonly participant: P) {}

  get clan() {
    return this.participant.clanId
  }

  get tz() {
    return this.participant.timezoneId
  }

  get tzPref() {
    return this.participant.timezonePreferenceId
  }
}

interface Cohort {
  tz: number // Timezone id
  fixed: Unit[] // The participants that want to play in their timezone
  fluid: Unit[] // The participants that accept playing in other timezones
}

interface Pod {
  timezoneId: number
  participants: Unit[]
}

const participantsByTimezone = contramap((u: Unit) => u.tz)(ordNumber)
const groupByTimezone = A.chop<Unit, Unit[]>(us => {
  const { init, rest } = A.spanLeft<Unit>(p => p.tz === us[0].tz)(us)
  return [init, rest]
})
const separateByTimezonePreference = A.partition<Unit>(part => part.tzPref === 'similar')
const groupInCohorts: (us: Unit[]) => Cohort[] = flow(
  A.sort(participantsByTimezone),
  groupByTimezone,
  A.map(separateByTimezonePreference),
  A.map(({ right: fixed, left: fluid }) => ({
    fixed,
    fluid,
    tz: (fixed[0] || fluid[0]).tz,
  }))
)

function mergeCohortsIfNeeded(cohs: Cohort[]): Cohort[] {
  if (areThereEnoughFluidParticipants(cohs)) {
    return cohs
  }

  const idxToFix = indexOfShortCohort(cohs)
  if (idxToFix == null) {
    throw Error('Weirdness')
  }

  // eslint-disable-next-line security/detect-object-injection
  const mover = cohs[idxToFix]
  const prev = cohs[idxToFix - 1]
  const prevSize = prev ? cohortSize(prev) : null
  const next = cohs[idxToFix + 1]
  const nextSize = next ? cohortSize(next) : null
  const receiver = prevSize != null && (nextSize == null || prevSize <= nextSize) ? prev : next

  receiver.fixed.concat(...mover.fixed)
  receiver.fluid.concat(...mover.fluid)

  return mergeCohortsIfNeeded(A.unsafeDeleteAt(idxToFix, cohs))
}

export function groupParticipantsInPods<P extends ParticipantMin>(participants: P[]): Cohort[] {
  if (!canBeDecomposedIn7sAnd8s(participants.length)) {
    throw Error('Unsupported tournament size')
  }

  const units = participants.map(participant => new ParticipantUnit(participant))
  const grouped = groupInCohorts(units)
  const merged = mergeCohortsIfNeeded(grouped)
  const adjusted = adjustCohorts(merged)
  const pods = A.chain(cohortToPods<>)(adjusted)
  console.log(merged)

  return merged
}
