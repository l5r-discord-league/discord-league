import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{}>({}),
}

export async function handler(
  req: ValidatedRequest<typeof schema, { tournamentId: string }>,
  res: express.Response
) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.status(400).send()
    return
  }

  // const participant = await db.insertParticipant({
  //   userId,
  //   tournamentId,
  //   clanId: req.body.clanId,
  //   timezoneId: req.body.timezoneId,
  //   timezonePreferenceId: req.body.timezonePreferenceId,
  // })
  res.status(201).send({})
}
