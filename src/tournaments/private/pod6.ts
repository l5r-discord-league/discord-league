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

  private bracketForSmallPod(position: number): ExtendedParticipant['bracket'] | null {
    return position < 3 ? 'goldCup' : position < 5 ? 'silverCup' : null
  }

  private bracketForLargePod(position: number): ExtendedParticipant['bracket'] | null {
    return position < 3 ? 'goldCup' : position < 6 ? 'silverCup' : null
  }

  protected rankParticipants(
    extendedParticipants: ExtendedParticipant[],
    matches: MatchData[]
  ): RankedParticipant[] {
    const rankedParticipants = rankPodParticipants(extendedParticipants, matches)
    const isSmallPod = extendedParticipants.length <= 6
    return rankedParticipants.flatMap(({ id }, idx) => {
      const participant = extendedParticipants.find(
        (extendedParticipant) => id === extendedParticipant.id
      )
      if (!participant) {
        return []
      }

      const position = idx + 1
      const bracket =
        typeof participant.bracket === 'string'
          ? participant.bracket
          : isSmallPod
          ? this.bracketForSmallPod(position)
          : this.bracketForLargePod(position)

      return { ...participant, position, bracket }
    })
  }
}
