import { Player } from './types'
import { contramap, Ord, ordNumber } from 'fp-ts/lib/Ord'

const nonSequentialCompatibleSizes = [6, 7, 12, 13, 14, 18, 19, 20, 21, 24, 25, 26, 27, 28, 30]
const alwaysCompatibleSize = nonSequentialCompatibleSizes[nonSequentialCompatibleSizes.length - 1]

export default class Bucket {
  constructor(public tzs: number[], public players: Player[] = []) {}
  addPlayer(player: Player): void {
    this.players.push(player)
  }

  get playersToCompatible(): number {
    const nextSize = nonSequentialCompatibleSizes.find((n) => n > this.players.length)
    return nextSize == null ? 0 : nextSize - this.players.length
  }

  get isCompatibleSize(): boolean {
    return (
      this.players.length > alwaysCompatibleSize ||
      nonSequentialCompatibleSizes.includes(this.players.length)
    )
  }

  static concat(a: Bucket, b: Bucket): Bucket {
    return new Bucket(a.tzs.concat(b.tzs), a.players.concat(b.players))
  }

  static byPlayerCountASC = contramap<number, Bucket>(({ players }) => players.length)(ordNumber)
  static byTimezonesCountASC = contramap<number, Bucket>(({ tzs }) => tzs.length)(ordNumber)
  static byPlayerToCompatibleDESC = contramap<number, Bucket>(
    ({ playersToCompatible }) => -playersToCompatible
  )(ordNumber)

  static byTimezoneProximity = (tzId: number): Ord<Bucket> =>
    contramap<number, Bucket>(({ tzs }) => tzs.map((tz) => Math.abs(tz - tzId)).sort()[0])(
      ordNumber
    )

  static byClanPopularityASC = (clanId: number): Ord<Bucket> =>
    contramap<number, Bucket>(
      ({ players }) => players.filter((player) => player.clanId === clanId).length / players.length
    )(ordNumber)
}
