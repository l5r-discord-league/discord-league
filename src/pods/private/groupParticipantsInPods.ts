import { Player, Pod } from './types'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { contramap, ordNumber } from 'fp-ts/lib/Ord'
import { pipe } from 'fp-ts/lib/function'
import Bucket from './bucket'

const byClan = contramap<number, Player>(player => player.clanId)(ordNumber)

const separateSimilarFromFluid = A.partition<Player>(
  player => player.timezonePreferenceId === 'similar'
)

const playersToBucketList = (players: Player[], bucketMergeCount: number): Bucket[] => {
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
  A.makeBy(Math.floor(players.length / 6), () => ({ timezones, players: [] }))

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
