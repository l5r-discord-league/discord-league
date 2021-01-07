import * as express from 'express-async-router'
import * as db from '../gateways/storage'
import { MatchRecord } from '../gateways/storage'

function getParticipantIdsForMatches(matches: MatchRecord[]): number[] {
  const participantIds: number[] = matches
    .map((match) => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB), [])
  return Array.from(new Set(participantIds))
}

export async function handler(req: express.Request, res: express.Response): Promise<void> {
  const userId = req.params.id
  if (!userId) {
    res.status(400).send()
    return
  }
  const userParticipations = await db.fetchParticipantsForUser(userId)

  const result = []
  for (const participation of userParticipations) {
    const tournament = await db.fetchTournament(participation.tournamentId)
    const matches = await db.fetchMatchesForMultipleParticipants([participation.id])
    const participantIds = getParticipantIdsForMatches(matches)
    const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)
    if (matches.length !== 0) {
      result.push({ tournament, matches, participants })
    }
  }
  res.status(200).send(result)
}
