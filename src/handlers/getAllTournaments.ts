import { Request, Response } from 'express'
import * as db from '../gateways/storage'

interface Tournament {
  id: number
  name: string
  startDate: Date
  statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
  typeId: 'monthly' | 'pod6'
  description?: string
  createdAt: Date
  updatedAt: Date
}

interface Output {
  upcoming: Tournament[]
  ongoing: Tournament[]
  past: Tournament[]
}

export async function handler(req: Request, res: Response<Output>): Promise<void> {
  const tournaments = await db.getAllTournaments()
  const grouped = tournaments
    .sort((a, b) => -(a.startDate.getTime() - b.startDate.getTime()))
    .reduce<Output>(
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
