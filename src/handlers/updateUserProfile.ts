import { User$patchById } from '@dl/api'
import { Response } from 'express'
import Joi from 'joi'

import * as discordClient from '../clients/discord'
import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<User$patchById['request']['body']>({
    permissions: Joi.number().integer().optional(),
    preferredClanId: Joi.number().integer().optional(),
    jigokuName: Joi.string().optional(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, User$patchById['request']['params']>,
  res: Response<User$patchById['response'] | string>
): Promise<void> {
  if (!req.user?.d_id) {
    res.sendStatus(401)
    return
  }

  const requestUser = await db.getUser(req.user.d_id)
  if (requestUser?.permissions !== 1 && req.user?.d_id !== req.params.userId) {
    res.status(403).send('You cannot update this user.')
    return
  }

  const userRow = await db.updateUser(req.params.userId, req.body)
  const discordUser = await discordClient.fetchUser(req.params.userId)

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
