import { ExtendedMatch, User$findMatches } from '@dl/api'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'

export async function handler(
  req: Request<User$findMatches['request']['params']>,
  res: Response<User$findMatches['response']>
): Promise<void> {
  const userId = req.params.userId
  if (!userId) {
    res.sendStatus(400)
    return
  }

  const tournaments = await db.fetchTournamentsForUser(userId)
  const extendedTournaments = await Promise.all(
    tournaments.map(async (tournament) => {
      const matches = await db.fetchMatchesForUserInTournament(userId, tournament.id)
      const extendedMatches = await Promise.all(
        matches.map(async (match) => {
          const [participantA, participantB] = await Promise.all([
            db.fetchParticipantWithUserData(match.playerAId),
            db.fetchParticipantWithUserData(match.playerBId),
          ])
          return { ...match, participantA, participantB }
        })
      )
      const { matchesDone, matchesToPlay } = extendedMatches.reduce<
        Record<'matchesDone' | 'matchesToPlay', ExtendedMatch[]>
      >(
        (acc, match) => {
          if (
            tournament.statusId !== 'group' ||
            match.winnerId != null ||
            match.participantA.dropped ||
            match.participantB.dropped
          ) {
            acc.matchesDone.push(match)
          } else {
            acc.matchesToPlay.push(match)
          }
          return acc
        },
        { matchesDone: [], matchesToPlay: [] }
      )

      return {
        tournament: { ...tournament, startDate: tournament.startDate.toJSON() },
        matchesDone,
        matchesToPlay,
      }
    })
  )
  const sortedTournaments = extendedTournaments.sort((a, b) => -(a.tournament.id - b.tournament.id))

  res.status(200).send(sortedTournaments)
}
