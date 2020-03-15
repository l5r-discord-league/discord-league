import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  if (!req.params.id || typeof req.params.id !== 'number') {
    res.status(400).send()
    return
  }
  const participants = await db.fetchTournamentParticipants(req.params.id)

  res.status(200).send(participants)
}
