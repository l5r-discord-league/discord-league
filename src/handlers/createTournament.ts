import * as express from 'express-async-router'
import Joi from 'joi'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{
    name: string
    startDate: Date
    status: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
    type: 'monthly' | 'pod6'
    description?: string
  }>({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    status: Joi.string().valid('upcoming', 'group', 'endOfGroup', 'bracket', 'finished').required(),
    type: Joi.string().valid('monthly', 'pod6').required(),
    description: Joi.string().allow('').optional(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema>,
  res: express.Response
): Promise<void> {
  const season = await db.createTournament({
    name: req.body.name,
    startDate: req.body.startDate,
    statusId: req.body.status,
    typeId: req.body.type,
    description: req.body.description,
  })

  res.status(201).send(season)
}
