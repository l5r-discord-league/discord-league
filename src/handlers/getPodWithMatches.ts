import * as express from 'express-async-router'
import * as db from '../gateways/storage'
import { toPodResults } from '../utils/toPodResults'

export function getParticipantIdsForMatches(matches: db.MatchRecordWithPodId[]): number[] {
  const participantIds: number[] = matches
    .map((match) => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB))
  return Array.from(new Set(participantIds))
}

export async function handler(req: express.Request, res: express.Response): Promise<void> {
  const podId = parseInt(req.params.podId, 10)
  if (isNaN(podId)) {
    res.status(400).send()
    return
  }

  const pod = await db.fetchPod(podId)
  const tournament = await db.fetchTournament(pod.tournamentId)
  if (!tournament) {
    res.status(404).send()
    return
  }

  const matches = await db.fetchMatchesForMultiplePods([pod.id])
  const participantIds = getParticipantIdsForMatches(matches)
  const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)

  res
    .status(200)
    .send(
      toPodResults(pod, matches, participants, !['upcoming', 'group'].includes(tournament.statusId))
    )
}
