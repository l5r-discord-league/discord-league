import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  /**
  await db.createTournament({
    name: 'Test Tournament',
    startDate: new Date(),
    status: 'upcoming',
    type: 'monthly',
    description: 'The test db',
  })**/
  const users = await db.getAllUsers()

  res.status(200).send(users)
}
