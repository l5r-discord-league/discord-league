import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response): Promise<void> {
  const tournaments = await db.getAllTournaments()
  res.status(200).send(tournaments)
}
