import { Tournament$findAll } from '@dl/api'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'

export async function handler(
  req: Request,
  res: Response<Tournament$findAll['response']>
): Promise<void> {
  const tournaments = await db.getAllTournaments()
  const grouped = tournaments
    .map((tournament) => ({
      ...tournament,
      startDate: tournament.startDate.toJSON(),
    }))
    .reduce<Tournament$findAll['response']>(
      (groups, tournament) => {
        switch (tournament.statusId) {
          case 'upcoming':
            groups.upcoming.push(tournament)
            return groups
          case 'finished':
            groups.past.push(tournament)
            return groups
          default:
            groups.ongoing.push(tournament)
            return groups
        }
      },
      { upcoming: [], ongoing: [], past: [] }
    )
  res.status(200).send(grouped)
}
