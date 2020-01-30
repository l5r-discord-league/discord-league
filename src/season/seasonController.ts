import { Season } from './season'
import { SeasonStatus } from './seasonStatus'
import { Request, Response } from 'express-async-router'
import uuid = require('uuid')

async function getExampleSeasons(): Promise<Season[]> {
  const season1 = new Season('exampleId1', 'Example Season 1')
  const season2 = new Season('exampleId2', 'Example Season 2')
  const season3 = new Season('exampleId3', 'Example Season 3')
  season3.status = SeasonStatus.Finished
  const season4 = new Season('exampleId4', 'Example Season 4')
  season4.status = SeasonStatus.GroupStage
  return [season1, season2, season3, season4]
}

export class SeasonController {
  // TODO Database Access
  constructor(private dbAccess: any) {}

  async getAllSeasons(): Promise<Season[]> {
    // TODO read from database
    return getExampleSeasons()
  }

  async getSeasonForId(req: Request): Promise<Season> {
    // TODO read from database
    return new Season(req.params.id, req.params.id)
  }

  async createSeason(req: Request, res: Response): Promise<void> {
    // new Season(uuid.v1(), req.body.name)
    // TODO save
    res.status(201).send()
  }

  async editSeason(req: Request, res: Response): Promise<void> {
    // TODO DBAccess find season for req.params.id
    // if (Season not found)
    // res.status(404).send()
    // else
    // TODO change stuff
    // TODO save back
    res.status(204).send()
  }

  async deleteSeason(req: Request, res: Response): Promise<void> {
    // TODO DBAccess find season for req.params.id
    // if (Season not found)
    // res.status(404).send()
    // else
    // TODO delete season
    res.status(204).send()
  }
}
