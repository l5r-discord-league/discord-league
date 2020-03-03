import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  if (!req.user?.d_id) {
    res.status(400).send()
    return
  }
  const user = await db.getUser(req.user.d_id)
  if (user) {
    console.log(user)
    res.status(200).send(user)
    return
  }
  res.status(404).send()
}
