import { Request, Response } from 'express-serve-static-core'

import * as db from '../gateways/storage'

export async function handler(req: Request<{ participantId: string }>, res: Response) {
  const participant = await db.fetchParticipant(parseInt(req.params.participantId, 10))
  if (participant == null) {
    return res.sendStatus(404)
  }

  const decklist = await db.fetchDecklistForParticipant(participant.id)
  if (!decklist) {
    return res.sendStatus(404)
  }

  if (!decklist.locked && (req.user?.d_id !== participant.userId || req.user?.flags !== 1)) {
    return res.sendStatus(403)
  }

  res.status(200).send(decklist)
}
