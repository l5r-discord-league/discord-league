import Joi from '@hapi/joi'
import * as express from 'express-async-router'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{
    name: string
    startDate: Date
    status: db.TournamentStatus
    type: db.TournamentType
    description?: string
  }>({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    status: Joi.string()
      .valid('upcoming', 'group', 'endOfGroup', 'bracket', 'finished')
      .required(),
    type: Joi.string()
      .valid('monthly')
      .required(),
    description: Joi.string().optional(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>, res: express.Response) {
  const season = await db.createTournament({
    name: req.body.name,
    startDate: req.body.startDate,
    status: req.body.status,
    type: req.body.type,
    description: req.body.description,
  })

  res.status(201).send(season)
}
