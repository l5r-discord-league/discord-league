import { User$findAll } from '@dl/api'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'

function getClanForId(id?: number): string {
  switch (id) {
    case 1:
      return 'Crab'
    case 2:
      return 'Crane'
    case 3:
      return 'Dragon'
    case 4:
      return 'Lion'
    case 5:
      return 'Phoenix'
    case 6:
      return 'Scorpion'
    case 7:
      return 'Unicorn'
    default:
      return 'Not specified'
  }
}

export async function handler(
  req: Request,
  res: Response<User$findAll['response']>
): Promise<void> {
  const users = await db.getAllUsers()

  const preparedUsers = users.map((user) => ({
    user,
    discordName: `${user.discordName}#${user.discordDiscriminator}`,
    jigokuName: user.jigokuName ?? 'Not specified',
    preferredClan: getClanForId(user.preferredClanId),
    userId: user.discordId,
    role: user.permissions === 1 ? 'Admin' : 'Player',
  }))

  res.status(200).send(preparedUsers)
}
