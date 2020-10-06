import * as db from '../gateways/storage'

interface PlayerRecord {
  participantId: number
  dropped: boolean
  wins: number
  losses: number
}

export interface PodResult extends db.TournamentPodRecord {
  matches: db.MatchRecordWithPodId[]
  participants: db.ParticipantWithUserData[]
  records: PlayerRecord[]
}

export function toPodResults(
  pod: db.TournamentPodRecord,
  allMatches: db.MatchRecordWithPodId[],
  allPlayers: db.ParticipantWithUserData[],
  isFinalRecords: boolean
): PodResult {
  const podMatches = allMatches.filter(match => match.podId === pod.id)
  const players = allPlayers.filter(participant =>
    podMatches.some(
      match => participant.id === match.playerAId || participant.id === match.playerBId
    )
  )
  const records = allMatches.reduce(
    (records, match) => {
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
      } else if (isFinalRecords) {
        // enforce double loss to unplayed matches
        recordPlayerA.losses = recordPlayerA.losses + 1
        recordPlayerB.losses = recordPlayerB.losses + 1
      }

      return records
    },
    allPlayers.reduce<Record<number, PlayerRecord>>(
      (initialRecords, player) => ({
        ...initialRecords,
        [player.id]: { participantId: player.id, dropped: player.dropped, wins: 0, losses: 0 },
      }),
      {}
    )
  )
  return { ...pod, matches: podMatches, participants: players, records: Object.values(records) }
}
