import { Request, Response } from 'express-serve-static-core'

import * as db from '../gateways/storage'

function isAdmin(req: Request): boolean {
  return req.user?.flags === 1
}

export async function handler(
  req: Request<{ participantId: string }>,
  res: Response
): Promise<void> {
  const participant = await db.fetchParticipant(parseInt(req.params.participantId, 10))
  if (participant == null) {
    res.sendStatus(404)
    return
  }
  if (!isAdmin(req) && req.user?.d_id !== participant.userId) {
    res.status(403).send('You cannot delete a decklist for this user.')
    return
  }

  const decklist = await db.fetchDecklistForParticipant(participant.id)
  if (!isAdmin(req) && decklist?.locked) {
    res.status(403).send('You cannot delete a locked list')
    return
  }

  await db.deleteDecklist(participant.id)

  res.sendStatus(204)
}
