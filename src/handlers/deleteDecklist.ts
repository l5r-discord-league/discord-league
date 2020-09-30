import { Request, Response } from 'express-serve-static-core'

import * as db from '../gateways/storage'

function isAdmin(req: Request): boolean {
  return req.user?.flags === 1
}

export async function handler(req: Request<{ participantId: string }>, res: Response) {
  const participant = await db.fetchParticipant(parseInt(req.params.participantId, 10))
  if (participant == null) {
    return res.sendStatus(404)
  }
  if (!isAdmin(req) && req.user?.d_id !== participant.userId) {
    return res.status(403).send('You cannot delete a decklist for this user.')
  }

  const decklist = await db.fetchDecklistForParticipant(participant.id)
  if (!isAdmin(req) && decklist?.locked) {
    return res.status(403).send('You cannot delete a locked list')
  }

  await db.deleteDecklist(participant.id)

  res.sendStatus(204)
}
