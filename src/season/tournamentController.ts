import { Tournament } from './tournament'
import { TournamentStatus } from './tournamentStatus'
import { Request, Response } from 'express-async-router'

async function getExampleTournaments(): Promise<Tournament[]> {
  const season1 = new Tournament('exampleId1', 'Example Tournament 1')
  const season2 = new Tournament('exampleId2', 'Example Tournament 2')
  const season3 = new Tournament('exampleId3', 'Example Tournament 3')
  season3.status = TournamentStatus.Finished
  const season4 = new Tournament('exampleId4', 'Example Tournament 4')
  season4.status = TournamentStatus.GroupStage
  return [season1, season2, season3, season4]
}

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
