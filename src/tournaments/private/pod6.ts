import { LeagueBase } from './leagueBase'
import { PlayerRecord, MatchData, ExtendedParticipant, RankedParticipant } from './types'
import { rankPodParticipants } from '../../pods'

export class Pod6Tournament extends LeagueBase {
  protected playerRecordReduce(
    records: Record<number, PlayerRecord>,
    match: MatchData
  ): Record<number, PlayerRecord> {
    const { [match.playerAId]: recordPlayerA, [match.playerBId]: recordPlayerB } = records
    if (match.winnerId != null) {
      const [winnerRecord, loserRecord] =
        match.winnerId === recordPlayerA.participantId
          ? [recordPlayerA, recordPlayerB]
          : [recordPlayerB, recordPlayerA]
      winnerRecord.wins = winnerRecord.wins + 1
      loserRecord.losses = loserRecord.losses + 1
    }

    return records
  }

  protected rankParticipants(
    extendedParticipants: ExtendedParticipant[],
    matches: MatchData[]
  ): RankedParticipant[] {
    const rankedParticipants = rankPodParticipants(extendedParticipants, matches)
    return rankedParticipants.flatMap(({ id }, idx) => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...extendedParticipants.find((extendedParticipant) => id === extendedParticipant.id)!,
      position: idx + 1,
    }))
  }
}
