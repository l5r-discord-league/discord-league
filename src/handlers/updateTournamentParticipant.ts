import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{
    id: number
    userId: string
    clanId: number
    timezoneId: number
    timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  }>({
    id: Joi.number().required(),
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

export async function handler(req: ValidatedRequest<typeof schema>, res: express.Response) {
  if (!req.params.tournamentId || !req.params.id) {
    res.status(400).send('No Tournament ID or Participation ID was provided.')
    return
  }
  if (!req.user?.d_id) {
    res.status(401).send('You need to be logged in.')
    return
  }
  const requestUser = await db.getUser(req.user.d_id)
  const participant = await db.fetchTournamentParticipant(parseInt(req.params.id, 10))
  if (!participant) {
    res.status(404).send('Participation could not be found.')
    return
  }
  if (requestUser.permissions !== 1 && req.user?.d_id !== participant.userId) {
    res.status(403).send('You cannot update participations for this user.')
    return
  }
  await db.updateParticipant(req.body)
  const updatedParticipant = await db.fetchTournamentParticipantWithUserData(participant.id)

  res.status(200).send(updatedParticipant)
}
