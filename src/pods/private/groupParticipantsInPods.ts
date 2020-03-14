import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { ordNumber, contramap, ordBoolean } from 'fp-ts/lib/Ord'
import { fst } from 'fp-ts/lib/ReadonlyTuple'
import { flow } from 'fp-ts/lib/function'

import { ParticipantRecord } from '../../gateways/storage'
import { Pod } from './types'

// Just an alias to shorten things a bit. Will be refered as `part`, or `parts` for arrays
type Participant = ParticipantRecord

/**
 * A Cohort is a group of players that share the same Timezone preference.
 * Will be refered as `coh`, or `cohs` for arrays
 */
interface Cohort {
  tz: number // Timezone id
  fixed: Participant[] // The participants that want to play in their timezone
  fluid: Participant[] // The participants that accept playing in other timezones
}

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
const canBeDecomposedIn7sAnd8s = (n: number) => {
  if (n >= 42) {
    return true
  }

  /**
   * Checks if there's any integer x and y for which the following expression is solvable
   * n = 7y + 8x
   */
  for (let x = 0, topX = Math.floor(n / 8); x <= topX; x++) {
    for (let y = 0, topY = Math.floor(n / 7); y <= topY; y++) {
      if (n === 8 * x + 7 * y) {
        return true
      }
    }
  }

  return false
}

const cohortSize = (coh: Cohort): number => coh.fixed.length + coh.fluid.length

const participantsByTimezone = contramap((part: Participant) => part.timezoneId)(ordNumber)
const groupByTimezone = A.chop<Participant, Participant[]>(parts => {
  const { init, rest } = A.spanLeft<Participant>(p => p.timezoneId === parts[0].timezoneId)(parts)
  return [init, rest]
})
const putParticipantsWhoPreferSameTimezoneOnTheRight = A.partition<Participant>(
  part => part.timezonePreferenceId === 'similar'
)
/**
 * Turns a partipant list into a list of cohorts
 */
const groupInCohorts: (parts: Participant[]) => Cohort[] = flow(
  A.sort(participantsByTimezone),
  groupByTimezone,
  A.map(putParticipantsWhoPreferSameTimezoneOnTheRight),
  A.map(({ right: fixed, left: fluid }) => ({ fixed, fluid, tz: fixed[0].timezoneId }))
)

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
    throw Error('No short group and not ready')
  }

  const receiver = O.toNullable(A.lookup(idxToFix, cohs))
  if (!receiver) {
    // This should never happen, bu typescript didn't believe me.
    throw Error('Unexpected error')
  }

  const donorsNeeded = MIN_FOR_ALLOC - cohortSize(receiver)

  const otherGroups = A.unsafeDeleteAt(idxToFix, cohs)
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
const createEmptyPods = (timezoneId: number, parts: Participant[]) =>
  A.makeBy(Math.ceil(parts.length / 8), () => ({ timezoneId, participants: [] }))

const distributeClansInPods = (idx: number, pods: Pod[], part: Participant) => {
  pods[idx % pods.length].participants.push(part)
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
  const perClan = A.sort(contramap((part: Participant) => part.clanId)(ordNumber))([
    ...coh.fixed,
    ...coh.fluid,
  ])
  return A.reduceWithIndex(createEmptyPods(coh.tz, perClan), distributeClansInPods)(perClan)
}

const process: (parts: Participant[]) => Pod[] = flow(
  groupInCohorts, // Group in cohorts by sharing the same timezone
  adjustCohorts, // Adjust the cohorts so they have the minimum side, respecting timezone preferences
  A.chain(cohortToPods) // Turn each cohort into groups of 8 or 7 participants
)

/**
 * Groups a list of Participants in pods, according to timezone preferences and trying to spread
 * the clans as evenly as possible
 */
export function groupParticipantsInPods(parts: Participant[]): Pod[] {
  if (!canBeDecomposedIn7sAnd8s(parts.length)) {
    throw Error('Unsupported tournament size')
  }

  return process(parts)
}
