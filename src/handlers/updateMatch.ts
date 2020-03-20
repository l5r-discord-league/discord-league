import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{
    id: number
    winnerId: number
    victoryConditionId: number
    firstPlayerId?: number
    deckARoleId?: number
    deckBRoleId?: number
    deckASplashId?: number
    deckBSplashId?: number
  }>({
    id: Joi.number()
      .integer()
      .required(),
    winnerId: Joi.number()
      .integer()
      .required(),
    victoryConditionId: Joi.number()
      .integer()
      .min(1)
      .required(),
    firstPlayerId: Joi.number()
      .integer()
      .optional(),
    deckARoleId: Joi.number()
      .integer()
      .min(1)
      .optional(),
    deckBRoleId: Joi.number()
      .integer()
      .min(1)
      .optional(),
    deckASplashId: Joi.number()
      .integer()
      .min(1)
      .optional(),
    deckBSplashId: Joi.number()
      .integer()
      .min(1)
      .optional(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>, res: express.Response) {
  const matchId = parseInt(req.params.id, 10)
  if (isNaN(matchId)) {
    res.status(400).send('No match ID was provided.')
    return
  }

  const match = await db.fetchMatch(matchId)
  if (!match) {
    res.status(404).send('Match could not be found.')
    return
  }
  const participants = await db.fetchMultipleParticipantsWithUserData([
    match.playerAId,
    match.playerBId,
  ])
  if (!participants.find(participant => participant.userId === req.user?.d_id)) {
    res.status(403).send('You cannot update a match you are not participating in.')
    return
  }
  const updatedMatch = await db.updateMatch(req.body)

  res.status(200).send(updatedMatch)
}
