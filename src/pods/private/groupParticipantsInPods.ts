import { Player, Pod } from './types'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { contramap, ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/function'
import {
  Bucket,
  Bucket67,
  Bucket78,
  byClanPopularityASC,
  byPlayerCountASC,
  byPlayerToCompatibleDESC,
  byTimezoneProximity,
  byTimezonesCountASC,
  concat,
} from './bucket'

const byClan = contramap<number, Player>((player) => player.clanId)(ordNumber)

const separateSimilarFromFluid = A.partition<Player>(
  (player) => player.timezonePreferenceId === 'similar'
)

const playersToBucketList = (
  BucketClass: typeof Bucket,
  players: Player[],
  bucketMergeCount: number
): Bucket[] => {
  let buckets = players
    .reduce<Bucket[]>((acc, player) => {
      const bucket = acc[player.timezoneId]
      if (bucket) {
        bucket.addPlayer(player)
        return acc
      } else {
        acc[player.timezoneId] = new BucketClass([player.timezoneId], [player])
        return acc
      }
    }, [])
    .filter((a) => a.players.length > 0)

  for (let i = 0; i < bucketMergeCount; i++) {
    const [smallBucket, ...otherBuckets] = A.sortBy([byTimezonesCountASC, byPlayerCountASC])(
      buckets
    )
    const [receiverBucket, ...restOfBuckets] = A.sortBy([
      byTimezoneProximity(smallBucket.tzs[0]),
      byPlayerCountASC,
    ])(otherBuckets)
    if (!receiverBucket) {
      throw Error('the bucketMergeCount is too big')
    }
    const mergedBucket = concat(smallBucket, receiverBucket)

    buckets = [mergedBucket, ...restOfBuckets]
  }

  return buckets
}

const toBuckets = (
  BucketClass: typeof Bucket,
  fluid: Player[],
  similar: Player[],
  bucketsMerged = 0
): Bucket[] => {
  const buckets = playersToBucketList(BucketClass, similar, bucketsMerged)
  fluid.forEach((playerToAssign) => {
    pipe(
      buckets,
      A.sortBy([byPlayerToCompatibleDESC, byClanPopularityASC(playerToAssign.clanId)]),
      A.head,
      O.map((targetBucket) => targetBucket.addPlayer(playerToAssign))
    )
  })

  if (buckets.every((b) => b.isCompatibleSize)) {
    return buckets
  }

  return toBuckets(BucketClass, fluid, similar, bucketsMerged + 1)
}

const createEmptyPods = (timezones: number[], players: Player[]) =>
  A.makeBy(Math.floor(players.length / 6), () => ({ timezones, players: [] }))

const distributeClansInPods = (idx: number, pods: Pod[], part: Player) => {
  pods[idx % pods.length].players.push(part)
  return pods
}

const spreadInPods = A.chain<Bucket, Pod>((bucket) => {
  const sorted = A.sort(byClan)(bucket.players)
  return A.reduceWithIndex(createEmptyPods(bucket.tzs, sorted), distributeClansInPods)(sorted)
})

export function groupParticipantsInPods(bucketType: '67' | '78', players: Player[]): Pod[] {
  const { left: fluid, right: similar } = separateSimilarFromFluid(players)

  const d: typeof Bucket = bucketType === '67' ? Bucket67 : Bucket78
  const buckets = toBuckets(d, fluid, similar)

  return spreadInPods(buckets)
}
