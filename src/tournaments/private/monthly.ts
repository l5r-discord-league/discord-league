import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { contramap, ordNumber } from 'fp-ts/lib/Ord'

import { LeagueBase } from './leagueBase'
import { PlayerRecord, MatchData, ExtendedParticipant, RankedParticipant } from './types'

const byWinsDESC = contramap<number, ExtendedParticipant>((p) => -p.wins)(ordNumber)
const byGamesPlayedDESC = contramap<number, ExtendedParticipant>((p) => -(p.wins + p.losses))(
  ordNumber
)

export class MonthlyTournament extends LeagueBase {
  protected playerRecordReduce(
    records: Record<number, PlayerRecord>,
    match: MatchData
  ): Record<number, PlayerRecord> {
    const { [match.playerAId]: recordPlayerA, [match.playerBId]: recordPlayerB } = records

    if (recordPlayerA.dropped !== recordPlayerB.dropped) {
      // One of the participants dropped, but not both. Results need to be adjusted
      const [winner, loser] = recordPlayerA.dropped
        ? [recordPlayerB, recordPlayerA]
        : [recordPlayerA, recordPlayerB]
      winner.wins = winner.wins + 1
      loser.losses = loser.losses + 1
    } else if (match.winnerId != null) {
      // There's a match report, follow normal process
      const [winnerRecord, loserRecord] =
        match.winnerId === recordPlayerA.participantId
          ? [recordPlayerA, recordPlayerB]
          : [recordPlayerB, recordPlayerA]
      winnerRecord.wins = winnerRecord.wins + 1
      loserRecord.losses = loserRecord.losses + 1
    } else if (this.isPodStageDone) {
      // enforce double loss to unplayed matches
      recordPlayerA.losses = recordPlayerA.losses + 1
      recordPlayerB.losses = recordPlayerB.losses + 1
    }

    return records
  }

  private bracketForParticipant(extendeParticipant: ExtendedParticipant, matches: MatchData[]) {
    const matchCount = matches.filter(
      (m) => m.playerAId === extendeParticipant.id || m.playerBId === extendeParticipant.id
    ).length
    return typeof extendeParticipant.bracket === 'string'
      ? extendeParticipant.bracket
      : extendeParticipant.dropped
      ? null
      : extendeParticipant.wins >= matchCount - 2
      ? 'goldCup'
      : extendeParticipant.wins >= matchCount - 4
      ? 'silverCup'
      : null
  }

  protected rankParticipants(
    extendedParticipants: ExtendedParticipant[],
    matches: MatchData[]
  ): RankedParticipant[] {
    return pipe(
      extendedParticipants,
      A.sortBy([byWinsDESC, byGamesPlayedDESC]),
      A.mapWithIndex((idx, ep) => ({
        ...ep,
        position: idx + 1,
        bracket: this.bracketForParticipant(ep, matches),
      }))
    )
  }
}
