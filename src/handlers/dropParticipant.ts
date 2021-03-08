import { Participant$drop } from '@dl/api'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'

export async function handler(
  req: Request<Participant$drop['request']['params']>,
  res: Response<Participant$drop['response']>
): Promise<void> {
  const userTokenId = req.user?.d_id
  if (!userTokenId) {
    res.sendStatus(401)
    return
  }

  const participantId = parseInt(req.params.participantId, 10)
  if (isNaN(participantId)) {
    res.sendStatus(400)
    return
  }

  const participantToDrop = await db.fetchParticipant(participantId)
  if (!participantToDrop) {
    res.sendStatus(404)
    return
  }

  const requestingUser = await db.getUser(userTokenId)
  if (requestingUser?.permissions !== 1 && requestingUser?.discordId !== participantToDrop.userId) {
    res.sendStatus(403)
    return
  }

  await db.dropParticipant(participantId)

  res.sendStatus(204)
}
