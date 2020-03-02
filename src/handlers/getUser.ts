import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  const user = await db.getUser(req.params.id)
  if (user) {
    res.status(200).send(user)
  }
  res.status(404).send()
}
