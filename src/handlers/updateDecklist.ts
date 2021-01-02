import Joi from '@hapi/joi'
import { Response } from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{
    link: string
    decklist: string
  }>({
    link: Joi.string().required(),
    decklist: Joi.string().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, { participantId: string }>,
  res: Response
): Promise<void> {
  const participant = await db.fetchParticipant(parseInt(req.params.participantId, 10))
  if (participant == null) {
    res.sendStatus(404)
    return
  }
  if (!req.user?.d_id && req.user?.flags !== 1 && req.user?.d_id !== participant.userId) {
    res.status(403).send('You cannot register a decklist for this user.')
    return
  }

  const decklist = await db.fetchDecklistForParticipant(participant.id)
  if (!decklist) {
    res.sendStatus(404)
    return
  }
  if (decklist.locked && req.user?.flags !== 1) {
    res.sendStatus(403)
    return
  }

  const updatedRows = await db.updateDecklist(participant.id, req.body)

  if (updatedRows < 1) {
    res.sendStatus(404)
    return
  }

  res.sendStatus(200)
}
