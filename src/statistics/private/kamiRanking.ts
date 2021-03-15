import * as A from 'fp-ts/lib/Array'
import { markovStable } from './markovStable'

interface Match {
  playerAId: number
  playerBId: number
  winnerId: number
  victoryConditionId: number
  deckAClanId: number
  deckBClanId: number
}

type MatchTable = Map<number, Map<number, Match[]>>
const makeMatchTable = (): MatchTable =>
  new Map(A.makeBy(7, (idxA) => [idxA + 1, new Map(A.makeBy(7, (idxB) => [idxB + 1, []]))]))

const ClanVsClan = Symbol('ClanVsClan')

export function kamiRanking(matches: Match[]): [clanId: number, kamiPower: number][] {
  const table = matches.reduce((table, match) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    table.get(match.deckAClanId)!.get(match.deckBClanId)!.push(match)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    table.get(match.deckBClanId)!.get(match.deckAClanId)!.push(match)
    return table
  }, makeMatchTable())
  const ns = Array.from(table.entries()).map<[clanId: number, matchVector: number[]]>(
    ([clanId, matchMap]) => {
      const firstPass = Array.from(matchMap.entries()).map(([oppId, matches]) => {
        if (oppId === clanId) {
          return ClanVsClan
        }
        const losses = matches.filter((m) =>
          m.playerAId === m.winnerId ? m.deckBClanId === clanId : m.deckAClanId === clanId
        ).length
        return (losses + 1) / (matches.length + 2) / 7
      })
      const secondPass = firstPass.map((n) => {
        if (n !== ClanVsClan) {
          return n
        }
        return 1 - firstPass.reduce<number>((a, b) => (b === ClanVsClan ? a : a + b), 0)
      })

      return [clanId, secondPass]
    }
  )

  const matrix = ns.sort(([a], [b]) => a - b).map(([, vector]) => vector)
  const steady = markovStable(matrix)
  return A.zip([1, 2, 3, 4, 5, 6, 7], steady)
}
