import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  if (!req.params.id) {
    res.status(400).send()
    return
  }
  const tournament = await db.getTournament(req.params.id)
  if (tournament) {
    res.status(200).send(tournament)
    return
  }
  res.status(404).send()
}
