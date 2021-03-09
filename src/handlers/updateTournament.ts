import { Tournament$updateById, WithParsedDates } from '@dl/api'
import { Response } from 'express'
import Joi from 'joi'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<WithParsedDates<Tournament$updateById['request']['body'], 'startDate'>>({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    statusId: Joi.string()
      .valid('upcoming', 'group', 'endOfGroup', 'bracket', 'finished')
      .required(),
    typeId: Joi.string().valid('monthly', 'pod6').required(),
    description: Joi.string().allow('').optional(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, Tournament$updateById['request']['params']>,
  res: Response<Tournament$updateById['response']>
): Promise<void> {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.sendStatus(400)
    return
  }

  const tournament = await db.getTournament(tournamentId)
  if (!tournament) {
    res.sendStatus(404)
    return
  }

  await db.updateTournament(tournamentId, req.body)
  res.sendStatus(200)
}
