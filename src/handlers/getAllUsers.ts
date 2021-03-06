import { Request, Response } from 'express'
import * as db from '../gateways/storage'

export async function handler(req: Request, res: Response): Promise<void> {
  const users = await db.getAllUsers()

  res.status(200).send(users)
}
