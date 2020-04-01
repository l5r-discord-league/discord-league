import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { ordNumber, contramap } from 'fp-ts/lib/Ord'
import { fst } from 'fp-ts/lib/ReadonlyTuple'
import { flow } from 'fp-ts/lib/function'

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
  const perClan = A.sort(contramap((u: Unit) => u.clan)(ordNumber))(coh.units)
  return A.reduceWithIndex(createEmptyPods(coh.tz, perClan), distributeClansInPods)(perClan)
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
  tz: number
  units: Unit[]
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
const groupInCohorts: (us: Unit[]) => Cohort[] = flow(
  A.sort(participantsByTimezone),
  groupByTimezone,
  A.map(units => ({ units, tz: units[0].tz }))
)

const indexOfShortCohort: (cohs: Cohort[]) => number | null = flow(
  A.filterMapWithIndex<Cohort, [number, Cohort]>((idx, coh) =>
    coh.units.length < MIN_FOR_ALLOC ? O.some([idx, coh]) : O.none
  ),
  A.sort(contramap<number, [number, Cohort]>(([, coh]) => coh.units.length)(ordNumber)),
  A.head,
  O.map(fst),
  O.toNullable
)

const mergeCohortsIfNeeded = (donorsAvailable: Unit[], cohs: Cohort[]): Cohort[] => {
  const donorsNeeded = A.reduce<Cohort, number>(
    0,
    (sum, coh) => sum + Math.max(0, MIN_FOR_ALLOC - coh.units.length)
  )(cohs)
  if (donorsAvailable.length >= donorsNeeded) {
    return cohs
  }

  const idxToFix = indexOfShortCohort(cohs)
  if (idxToFix == null) {
    throw Error('Weirdness')
  }

  const mover = cohs[idxToFix]
  const prev = cohs[idxToFix - 1]
  const prevSize = prev ? prev.units.length : null
  const next = cohs[idxToFix + 1]
  const nextSize = next ? next.units.length : null
  const receiver = prevSize != null && (nextSize == null || prevSize <= nextSize) ? prev : next

  receiver.units.push(...mover.units)

  return mergeCohortsIfNeeded(donorsAvailable, A.unsafeDeleteAt(idxToFix, cohs))
}

const byCohortSize = contramap<number, Cohort>(coh => coh.units.length)(ordNumber)
const findDonorSpreadToMakeCohortsValid = (donors: Unit[], cohs: Cohort[]) =>
  flow(
    A.filter<Cohort>(coh => !canBeDecomposedIn7sAnd8s(coh.units.length)),
    A.reduce<Cohort, O.Option<[Cohort, Cohort]>>(O.none, (pair, coh) =>
      O.isNone(pair)
        ? O.some([coh, coh])
        : O.map<[Cohort, Cohort], [Cohort, Cohort]>(([min, max]) => [
            coh.units.length < min.units.length ? coh : min,
            coh.units.length > max.units.length ? coh : max,
          ])(pair)
    ),
    O.map(minMax =>
      A.comprehension(
        [[minMax], A.range(1, donors.length), A.range(1, donors.length)],
        (x, a, b): [typeof minMax, number, number] => [x, a, b],
        (x, a, b) =>
          a >= b &&
          a + b === donors.length &&
          canBeDecomposedIn7sAnd8s(x[0].units.length + a) &&
          canBeDecomposedIn7sAnd8s(x[1].units.length + b)
      )
    ),
    O.map(A.head),
    O.flatten
  )(cohs)
const distributeDonors = (donorsAvailable: Unit[], cohs: Cohort[]): Cohort[] => {
  if (A.isEmpty(donorsAvailable)) {
    console.log('done')
    console.log(
      'valid',
      cohs.map(c => [c.units.length, canBeDecomposedIn7sAnd8s(c.units.length)])
    )
    return cohs
  }

  const cohsBySize = A.sort(byCohortSize)(cohs)
  const cohUnderMinSize = cohsBySize.find(coh => coh.units.length < MIN_FOR_ALLOC)
  if (cohUnderMinSize) {
    const clanPriority = cohUnderMinSize.units
      .map(u => u.clan)
      .reduce(
        (prio, clan) => prio.set(clan, (prio.get(clan) || 0) + 1),
        new Map(A.makeBy(7, n => [n + 1, 0]))
      )
    const [donor, ...otherDonors] = A.sortBy<Unit>([
      contramap((u: Unit) => clanPriority.get(u.clan) || 0)(ordNumber),
      contramap((u: Unit) => Math.abs(u.tz - cohUnderMinSize.tz))(ordNumber),
    ])(donorsAvailable)
    cohUnderMinSize.units.push(donor)

    return distributeDonors(otherDonors, cohs)
  }

  // Extract invalid cohorts
  // Find valid spread of donors
  // A.comprehension([[['a','b']],A.range(1,11),A.range(1,11)],(x,a,b)=> [x,a,b], (x,a,b)=> a+b==11 && validCohortSizes)
  // Pick more balanced
  // Spread

  const spread = O.toNullable(findDonorSpreadToMakeCohortsValid(donorsAvailable, cohsBySize))
  if (spread == null) {
    throw Error('What now?')
  }

  // const donorsSplit = A.splitAt(
  //   flow(
  //     O.map(a => a[1]),
  //     O.getOrElse(() => 0)
  //   )(spread)
  // )(donorsAvailable)
  // console.log(spread)

  return cohs
}

export function groupParticipantsInPods<P extends ParticipantMin>(participants: P[]): Pod[] {
  if (!canBeDecomposedIn7sAnd8s(participants.length)) {
    throw Error('Unsupported tournament size')
  }

  const units = participants.map(participant => new ParticipantUnit(participant))
  const partitioned = A.partition<Unit>(u => u.tzPref === 'similar')(units)
  const byTz = groupInCohorts(partitioned.right)
  const fixedCohorts = mergeCohortsIfNeeded(partitioned.left, byTz)
  const distributed = distributeDonors(partitioned.left, fixedCohorts)

  return A.chain((coh: Cohort) => cohortToPods(coh))(distributed)
}
