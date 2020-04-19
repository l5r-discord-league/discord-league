import * as db from '../gateways/storage'

export function toPodResults(
  pod: db.TournamentPodRecord,
  allMatches: db.MatchRecordWithPodId[],
  allParticipants: db.ParticipantWithUserData[]
) {
  const matches = allMatches.filter(match => match.podId === pod.id)
  const participants = allParticipants.filter(participant =>
    matches.some(match => participant.id === match.playerAId || participant.id === match.playerBId)
  )
  const records = allMatches.reduce(
    (acc, match) => {
      const { [match.playerAId]: ra, [match.playerBId]: rb } = acc

      if (ra.dropped !== rb.dropped) {
        // One of the participants dropped, but not both. Results need to be adjusted
        const [winner, loser] = ra.dropped ? [rb, ra] : [ra, rb]
        winner.wins = winner.wins + 1
        loser.losses = loser.losses + 1
      } else if (match.winnerId != null) {
        // There's a match report, follow normal process
        const [winner, loser] = match.winnerId === ra.participantId ? [ra, rb] : [rb, ra]
        winner.wins = winner.wins + 1
        loser.losses = loser.losses + 1
      }

      return acc
    },
    allParticipants.reduce<
      Record<number, { participantId: number; wins: number; losses: number; dropped: boolean }>
    >(
      (initialRecords, { id, dropped }) => ({
        ...initialRecords,
        [id]: { participantId: id, wins: 0, losses: 0, dropped: dropped },
      }),
      {}
    )
  )
  return { ...pod, matches, participants, records: Object.values(records) }
}
