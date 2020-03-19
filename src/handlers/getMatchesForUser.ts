import * as express from 'express-async-router'
import * as db from '../gateways/storage'
import { MatchRecord } from '../gateways/storage'

function getParticipantIdsForMatches(matches: MatchRecord[]): number[] {
  const participantIds: number[] = matches
    .map(match => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB), [])
  return Array.from(new Set(participantIds))
}

export async function handler(req: express.Request, res: express.Response) {
  const userId = req.params.id
  if (!userId) {
    res.status(400).send()
    return
  }
  const userParticipations = await db.fetchParticipantsForUser(userId)
  const matches = await db.fetchMatchesForMultipleParticipants(
    userParticipations.map(participation => participation.id)
  )
  const participantIds = getParticipantIdsForMatches(matches)
  const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)

  res.status(200).send({
    matches,
    participants,
  })
}
