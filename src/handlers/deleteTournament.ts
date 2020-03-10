import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  if (!req.params.id) {
    res.status(400).send()
    return
  }
  const tournament = await db.getTournament(req.params.id)
  if (!tournament) {
    res.status(404).send()
    return
  }
  if (tournament.statusId !== 'upcoming') {
    res.status(405).send()
    return
  }
  await db.deleteTournament(req.params.id)
  res.status(204).send()
}
