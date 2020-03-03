import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  const users = await db.getAllUsers()

  res.status(200).send(users)
}
