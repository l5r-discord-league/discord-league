import { Decklist$updateForParticipant } from '@dl/api'
import { Response } from 'express'
import Joi from 'joi'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<Decklist$updateForParticipant['request']['body']>({
    link: Joi.string().required(),
    decklist: Joi.string().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, Decklist$updateForParticipant['request']['params']>,
  res: Response<Decklist$updateForParticipant['response']>
): Promise<void> {
  const participantId = parseInt(req.params.participantId, 10)
  if (isNaN(participantId)) {
    res.sendStatus(400)
    return
  }

  const participant = await db.fetchParticipant(participantId)
  if (participant == null) {
    res.sendStatus(404)
    return
  }
  if (!req.user?.d_id && req.user?.flags !== 1 && req.user?.d_id !== participant.userId) {
    res.sendStatus(403)
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
