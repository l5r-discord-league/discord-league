import { Request, Response } from 'express-serve-static-core'

import * as db from '../gateways/storage'

export async function handler(
  req: Request<{ participantId: string }>,
  res: Response
): Promise<void> {
  const participant = await db.fetchParticipant(parseInt(req.params.participantId, 10))
  if (participant == null) {
    res.sendStatus(404)
    return
  }

  const decklist = await db.fetchDecklistForParticipant(participant.id)
  if (!decklist) {
    res.sendStatus(404)
    return
  }

  if (!decklist.locked && (req.user?.d_id !== participant.userId || req.user?.flags !== 1)) {
    res.sendStatus(403)
    return
  }

  res.status(200).send(decklist)
}
