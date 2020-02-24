import { Tournament } from './tournament'
import { Request, Response } from 'express-async-router'

export class SeasonController {
  // TODO Database Access
  constructor(private dbAccess: object) {}

  async getTournamentForId(req: Request): Promise<Tournament> {
    // TODO read from database
    return new Tournament(req.params.id, req.params.id)
  }

  async editTournament(req: Request, res: Response): Promise<void> {
    // TODO DBAccess find season for req.params.id
    // if (Season not found)
    // res.status(404).send()
    // else
    // TODO change stuff
    // TODO save back
    res.status(204).send()
  }

  async deleteTournament(req: Request, res: Response): Promise<void> {
    // TODO DBAccess find season for req.params.id
    // if (Season not found)
    // res.status(404).send()
    // else
    // TODO delete season
    res.status(204).send()
  }
}
