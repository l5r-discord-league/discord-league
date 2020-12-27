import { Player } from './types'
import { contramap, ordNumber } from 'fp-ts/lib/Ord'

const nonSequentialCompatibleSizes = [6, 7, 12, 13, 14, 18, 19, 20, 21, 24, 25, 26, 27, 28, 30]
const alwaysCompatibleSize = nonSequentialCompatibleSizes[nonSequentialCompatibleSizes.length - 1]

export default class Bucket {
  constructor(public tzs: number[], public players: Player[] = []) {}
  addPlayer(player: Player) {
    this.players.push(player)
  }

  get playersToCompatible() {
    const nextSize = nonSequentialCompatibleSizes.find(n => n > this.players.length)
    return nextSize == null ? 0 : nextSize - this.players.length
  }

  get isCompatibleSize() {
    return (
      this.players.length > alwaysCompatibleSize ||
      nonSequentialCompatibleSizes.includes(this.players.length)
    )
  }

  static concat(a: Bucket, b: Bucket) {
    return new Bucket(a.tzs.concat(b.tzs), a.players.concat(b.players))
  }

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
