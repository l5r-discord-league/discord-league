import { Decklist$createForParticipant } from '@dl/api'
import { Response } from 'express'
import Joi from 'joi'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<Decklist$createForParticipant['request']['body']>({
    link: Joi.string().required(),
    decklist: Joi.string().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, Decklist$createForParticipant['request']['params']>,
  res: Response<Decklist$createForParticipant['response']>
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

  try {
    await db.createDecklist({
      participantId,
      locked: false,
      decklist: req.body.decklist,
      link: req.body.link,
    })
  } catch (e) {
    if (db.isDbError(e) && e.constraint === 'decklists_participantid_unique') {
      res.sendStatus(403)
      return
    }
    res.sendStatus(500)
    return
  }

  res.sendStatus(201)
}
