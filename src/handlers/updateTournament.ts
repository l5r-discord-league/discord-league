import Joi from '@hapi/joi'
import * as express from 'express-async-router'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{
    name: string
    startDate: Date
    statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
    typeId: 'monthly'
    description?: string
  }>({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    statusId: Joi.string()
      .valid('upcoming', 'group', 'endOfGroup', 'bracket', 'finished')
      .required(),
    typeId: Joi.string()
      .valid('monthly')
      .required(),
    description: Joi.string()
      .allow('')
      .optional(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>, res: express.Response) {
  if (!req.params.id) {
    return res.status(400).send('No Tournament ID was provided.')
  }

  const tournament = await db.getTournament(req.params.id)
  if (!tournament) {
    return res.status(404).send('No Tournament with ID ' + req.params.id)
  }

  const updatedTournament = await db.updateTournament(tournament.id, req.body)
  res.status(200).send(updatedTournament)
}
