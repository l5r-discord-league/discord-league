import { Player } from './types'
import { contramap, Ord, ordNumber } from 'fp-ts/lib/Ord'

export class Bucket {
  protected nonSequentialCompatibleSizes: number[] = []

  constructor(public tzs: number[], public players: Player[] = []) {}
  addPlayer(player: Player): void {
    this.players.push(player)
  }

  get playersToCompatible(): number {
    const nextSize = this.nonSequentialCompatibleSizes.find((n) => n > this.players.length)
    return nextSize == null ? 0 : nextSize - this.players.length
  }

  get isCompatibleSize(): boolean {
    return (
      this.players.length > this.alwaysCompatibleSize ||
      this.nonSequentialCompatibleSizes.includes(this.players.length)
    )
  }

  get alwaysCompatibleSize(): number {
    return this.nonSequentialCompatibleSizes[this.nonSequentialCompatibleSizes.length - 1]
  }
}

export class Bucket67 extends Bucket {
  static minimumPlayerCount = 6

  protected nonSequentialCompatibleSizes = [
    6, 7, 12, 13, 14, 18, 19, 20, 21, 24, 25, 26, 27, 28, 30,
  ]
}
export class Bucket78 extends Bucket {
  static minimumPlayerCount = 7

  protected nonSequentialCompatibleSizes = [
    7, 8, 14, 15, 16, 21, 22, 23, 24, 28, 29, 30, 31, 32, 35, 36, 37, 38, 39, 40, 42,
  ]
}

export function concat(a: Bucket, b: Bucket): Bucket {
  if (a instanceof Bucket67 && b instanceof Bucket67) {
    return new Bucket67(a.tzs.concat(b.tzs), a.players.concat(b.players))
  }
  return new Bucket78(a.tzs.concat(b.tzs), a.players.concat(b.players))
}

export const byPlayerCountASC = contramap<number, Bucket>(({ players }) => players.length)(
  ordNumber
)
export const byTimezonesCountASC = contramap<number, Bucket>(({ tzs }) => tzs.length)(ordNumber)

export const byPlayerToCompatibleDESC = contramap<number, Bucket>(
  ({ playersToCompatible }) => -playersToCompatible
)(ordNumber)

export const byTimezoneProximity = (tzId: number): Ord<Bucket> =>
  contramap<number, Bucket>(({ tzs }) => tzs.map((tz) => Math.abs(tz - tzId)).sort()[0])(ordNumber)

export const byClanPopularityASC = (clanId: number): Ord<Bucket> =>
  contramap<number, Bucket>(
    ({ players }) => players.filter((player) => player.clanId === clanId).length / players.length
  )(ordNumber)
