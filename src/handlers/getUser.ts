import { Request, Response } from 'express'
import * as discordClient from '../clients/discord'
import * as db from '../gateways/storage'
import { User$findById } from '@dl/api'

export async function handler(
  req: Request<User$findById['request']['params']>,
  res: Response<User$findById['response']>
): Promise<void> {
  const [userRow, discordUser] = await Promise.all([
    db.getUser(req.params.userId),
    discordClient.fetchUser(req.params.userId),
  ])

  if (!userRow || !discordUser) {
    res.status(404).send()
    return
  }

  const user = {
    jigokuName: userRow.jigokuName,
    permissions: userRow.permissions,
    preferredClanId: userRow.preferredClanId,
    discordId: discordUser.id,
    tag: discordUser.tag,
    displayAvatarURL: discordUser.displayAvatarURL(),
  }

  res.status(200).send(user)
}
