import { User$findAll } from '@dl/api'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'

const clanName = new Map([
  [1, 'Crab'],
  [2, 'Crane'],
  [3, 'Dragon'],
  [4, 'Lion'],
  [5, 'Phoenix'],
  [6, 'Scorpion'],
  [7, 'Unicorn'],
])
const defaultName = 'Not specified'

function getClanForId(id?: number): string {
  return id == null ? defaultName : clanName.get(id) ?? defaultName
}

function displayAvatarURL(userId: string, userAvatar: string) {
  return `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.webp`
}

function permissionsToRole(permissions: number): 'Player' | 'Admin' {
  return permissions === 1 ? 'Admin' : 'Player'
}

export async function handler(
  req: Request,
  res: Response<User$findAll['response']>
): Promise<void> {
  const users = await db.getAllUsers()

  const preparedUsers = users.map((user) => ({
    discordName: `${user.discordName}#${user.discordDiscriminator}`,
    displayAvatarURL: displayAvatarURL(user.discordId, user.discordAvatar),
    jigokuName: user.jigokuName ?? 'Not specified',
    preferredClan: getClanForId(user.preferredClanId),
    preferredClanId: user.preferredClanId,
    role: permissionsToRole(user.permissions),
    userId: user.discordId,
  }))

  res.status(200).send(preparedUsers)
}
