import { User$findMatches } from '@dl/api'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'

function getParticipantIdsForMatches(matches: db.MatchRecord[]): number[] {
  const participantIds: number[] = matches
    .map((match) => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB), [])
  return Array.from(new Set(participantIds))
}

export async function handler(
  req: Request<User$findMatches['request']['params']>,
  res: Response<User$findMatches['response']>
): Promise<void> {
  const userId = req.params.userId
  if (!userId) {
    res.status(400).send()
    return
  }
  const userParticipations = await db.fetchParticipantsForUser(userId)

  const data = []
  for (const participation of userParticipations) {
    const tournament = await db.fetchTournament(participation.tournamentId)
    const matches = await db.fetchMatchesForMultipleParticipants([participation.id])
    const participantIds = getParticipantIdsForMatches(matches)
    const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)
    if (tournament && matches.length !== 0) {
      data.push({ tournament, matches, participants })
    }
  }

  const preppedData = data.map((d) => ({
    ...d,
    tournament: {
      ...d.tournament,
      startDate: d.tournament.startDate.toJSON(),
      createdAt: d.tournament.createdAt.toJSON(),
      updatedAt: d.tournament.updatedAt.toJSON(),
    },
  }))
  const sortedData = preppedData.sort((a, b) => -(a.tournament.id - b.tournament.id))

  res.status(200).send(sortedData)
}
