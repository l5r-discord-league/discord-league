import { Player, Pod } from './types'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { contramap, ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/function'

class Bucket {
  constructor(public tzs: number[], public players: Player[] = []) {}
  addPlayer(player: Player) {
    this.players.push(player)
  }

  get playersToCompatible() {
    const nextSize = Bucket.nonSequentialCompatibleSizes.find(n => n > this.players.length)
    return nextSize == null ? 0 : nextSize - this.players.length
  }

  get isCompatibleSize() {
    return (
      this.players.length > 42 || Bucket.nonSequentialCompatibleSizes.includes(this.players.length)
    )
  }

  static concat(a: Bucket, b: Bucket) {
    return new Bucket(a.tzs.concat(b.tzs), a.players.concat(b.players))
  }

  static nonSequentialCompatibleSizes = [
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
    42,
  ]

  static byPlayerCountASC = contramap<number, Bucket>(({ players }) => players.length)(ordNumber)
  static byTimezonesCountASC = contramap<number, Bucket>(({ tzs }) => tzs.length)(ordNumber)
  static byPlayerToCompatibleDESC = contramap<number, Bucket>(
    ({ playersToCompatible }) => -playersToCompatible
  )(ordNumber)

  static byTimezoneProximity = (tzId: number) =>
    contramap<number, Bucket>(({ tzs }) => tzs.map(tz => Math.abs(tz - tzId)).sort()[0])(ordNumber)

  static byClanPopularityASC = (clanId: number) =>
    contramap<number, Bucket>(
      ({ players }) => players.filter(player => player.clanId === clanId).length / players.length
    )(ordNumber)
}

const byClan = contramap<number, Player>(player => player.clanId)(ordNumber)

const separateSimilarFromFluid = A.partition<Player>(
  player => player.timezonePreferenceId === 'similar'
)

const playersToBucketList = (players: Player[], bucketMergeCount: number) => {
  let buckets = players
    .reduce<Bucket[]>((acc, player) => {
      const bucket = acc[player.timezoneId]
      if (bucket) {
        bucket.addPlayer(player)
        return acc
      } else {
        acc[player.timezoneId] = new Bucket([player.timezoneId], [player])
        return acc
      }
    }, [])
    .filter(a => a.players.length > 0)

  for (let i = 0; i < bucketMergeCount; i++) {
    const [smallBucket, ...otherBuckets] = A.sortBy([
      Bucket.byTimezonesCountASC,
      Bucket.byPlayerCountASC,
    ])(buckets)
    const [receiverBucket, ...restOfBuckets] = A.sortBy([
      Bucket.byTimezoneProximity(smallBucket.tzs[0]),
      Bucket.byPlayerCountASC,
    ])(otherBuckets)
    if (!receiverBucket) {
      throw Error('the bucketMergeCount is too big')
    }
    const mergedBucket = Bucket.concat(smallBucket, receiverBucket)

    buckets = [mergedBucket, ...restOfBuckets]
  }

  return buckets
}

const toBuckets = (fluid: Player[], similar: Player[], bucketsMerged = 0): Bucket[] => {
  const buckets = playersToBucketList(similar, bucketsMerged)
  fluid.forEach(playerToAssign => {
    pipe(
      buckets,
      A.sortBy([
        Bucket.byPlayerToCompatibleDESC,
        Bucket.byClanPopularityASC(playerToAssign.clanId),
      ]),
      A.head,
      O.map(targetBucket => targetBucket.addPlayer(playerToAssign))
    )
  })

  if (buckets.every(b => b.isCompatibleSize)) {
    return buckets
  }

  return toBuckets(fluid, similar, bucketsMerged + 1)
}

const createEmptyPods = (timezones: number[], players: Player[]) =>
  A.makeBy(Math.ceil(players.length / 8), () => ({ timezones, players: [] }))

const distributeClansInPods = (idx: number, pods: Pod[], part: Player) => {
  pods[idx % pods.length].players.push(part)
  return pods
}

const spreadInPods = A.chain<Bucket, Pod>(bucket => {
  const sorted = A.sort(byClan)(bucket.players)
  return A.reduceWithIndex(createEmptyPods(bucket.tzs, sorted), distributeClansInPods)(sorted)
})

export function groupParticipantsInPods(players: Player[]) {
  const { left: fluid, right: similar } = separateSimilarFromFluid(players)

  const buckets = toBuckets(fluid, similar)

  return spreadInPods(buckets)
}
