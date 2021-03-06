import { User$findAll } from '@dl/api'
import { Request, Response } from 'express'

import { selectAllUsers } from '../users'

export async function handler(
  req: Request,
  res: Response<User$findAll['response']>
): Promise<void> {
  const users = await selectAllUsers()

  res.status(200).send(users)
}
