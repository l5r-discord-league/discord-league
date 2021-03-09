import { Tournament$findAll } from '@dl/api'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'

export async function handler(
  req: Request,
  res: Response<Tournament$findAll['response']>
): Promise<void> {
  const tournaments = await db.getAllTournaments()
  const grouped = tournaments
    .sort((a, b) => -(a.startDate.getTime() - b.startDate.getTime()))
    .map((tournament) => ({
      ...tournament,
      startDate: tournament.startDate.toJSON(),
      createdAt: tournament.createdAt.toJSON(),
      updatedAt: tournament.updatedAt.toJSON(),
    }))
    .reduce<Tournament$findAll['response']>(
      (acc, tournament) => {
        switch (tournament.statusId) {
          case 'upcoming':
            acc.upcoming.push(tournament)
            return acc
          case 'finished':
            acc.past.push(tournament)
            return acc
          default:
            acc.ongoing.push(tournament)
            return acc
        }
      },
      {
        upcoming: [],
        ongoing: [],
        past: [],
      }
    )
  res.status(200).send(grouped)
}
