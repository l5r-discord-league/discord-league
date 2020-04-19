import * as express from 'express-async-router'
import * as db from '../gateways/storage'
import { toPodResults } from '../utils/toPodResults'

function getParticipantIdsForMatches(matches: db.MatchRecordWithPodId[]): number[] {
  const participantIds: number[] = matches
    .map(match => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB))
  return Array.from(new Set(participantIds))
}

export async function handler(req: express.Request, res: express.Response) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.status(400).send()
    return
  }
  const pods = await db.fetchTournamentPods(tournamentId)
  const matches = await db.fetchMatchesForMultiplePods(pods.map(pod => pod.id))
  const participantIds = getParticipantIdsForMatches(matches)
  const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)

  res.status(200).send(pods.map(pod => toPodResults(pod, matches, participants)))
}
