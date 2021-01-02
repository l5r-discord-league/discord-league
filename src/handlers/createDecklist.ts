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

  try {
    await db.createDecklist({
      decklist: req.body.decklist,
      link: req.body.link,
      participantId: participant.id,
      locked: false,
    })
  } catch (e) {
    if (e.constraint === 'decklists_participantid_unique') {
      res.status(403).send('This participant already has a decklist. Edit it instead')
      return
    }
    res.sendStatus(500)
    return
  }

  res.sendStatus(201)
}
