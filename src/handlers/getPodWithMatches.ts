import * as express from 'express-async-router'
import * as db from '../gateways/storage'
import { MatchRecordWithPodId } from '../gateways/storage'

function getParticipantIdsForMatches(matches: MatchRecordWithPodId[]): number[] {
  const participantIds: number[] = matches
    .map(match => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB))
  return Array.from(new Set(participantIds))
}

export async function handler(req: express.Request, res: express.Response) {
  const podId = parseInt(req.params.podId, 10)
  if (isNaN(podId)) {
    res.status(400).send()
    return
  }
  const pod = await db.fetchPod(podId)
  const matches = await db.fetchMatchesForMultiplePods([pod.id])
  const participantIds = getParticipantIdsForMatches(matches)
  const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)

  const records = matches.reduce(
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
    participants.reduce<
      Record<number, { participantId: number; wins: number; losses: number; dropped: boolean }>
    >(
      (initialRecords, { id, dropped }) => ({
        ...initialRecords,
        [id]: { participantId: id, wins: 0, losses: 0, dropped: dropped },
      }),
      {}
    )
  )

  res.status(200).send({ ...pod, matches, participants, records })
}
