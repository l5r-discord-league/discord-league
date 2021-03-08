import { Match$updateReport } from '@dl/api'
import Joi from '@hapi/joi'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<Match$updateReport['request']['body']>({
    id: Joi.number().integer().required(),
    winnerId: Joi.number().integer().required(),
    victoryConditionId: Joi.number().integer().min(1).required(),
    firstPlayerId: Joi.number().integer().optional(),
    deckARoleId: Joi.number().integer().min(1).optional(),
    deckBRoleId: Joi.number().integer().min(1).optional(),
    deckASplashId: Joi.number().integer().min(1).optional(),
    deckBSplashId: Joi.number().integer().min(1).optional(),
  }),
}

function userIsAdmin(request: Request) {
  return request.user?.flags === 1
}

function userIsParticipant(request: Request, participants: db.ParticipantWithUserData[]) {
  return participants.find((participant) => participant.userId === request.user?.d_id)
}

export async function handler(
  req: ValidatedRequest<typeof schema, Match$updateReport['request']['params']>,
  res: Response<Match$updateReport['response']>
): Promise<void> {
  const matchId = parseInt(req.params.matchId, 10)
  if (isNaN(matchId)) {
    res.sendStatus(400)
    return
  }

  const match = await db.fetchMatch(matchId)
  if (!match) {
    res.sendStatus(404)
    return
  }

  const participants = await db.fetchMultipleParticipantsWithUserData([
    match.playerAId,
    match.playerBId,
  ])

  if (!(userIsAdmin(req) || userIsParticipant(req, participants))) {
    res.sendStatus(403)
    return
  }

  await db.updateMatch(req.body)

  res.sendStatus(204)
}
