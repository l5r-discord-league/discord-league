import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{
    userId: string
    clanId: number
    timezoneId: number
    timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  }>({
    userId: Joi.string().required(),
    clanId: Joi.number()
      .integer()
      .min(1)
      .required(),
    timezoneId: Joi.number()
      .integer()
      .min(1)
      .required(),
    timezonePreferenceId: Joi.string()
      .valid('similar', 'neutral', 'dissimilar')
      .required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, { tournamentId: string }>,
  res: express.Response
) {
  const userId = req.user?.d_id
  if (!req.user?.d_id) {
    res.status(403).send()
    return
  }
  const requestUser = await db.getUser(req.user?.d_id)
  if (requestUser.permissions !== 1 && requestUser.discordId !== req.body.userId) {
    res.status(403).send('You cannot register this user as participant.')
  }

  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.status(400).send()
    return
  }

  const participant = await db.insertParticipant({
    userId: req.body.userId,
    tournamentId: tournamentId,
    clanId: req.body.clanId,
    timezoneId: req.body.timezoneId,
    timezonePreferenceId: req.body.timezonePreferenceId,
  })
  res.status(201).send(participant)
}
