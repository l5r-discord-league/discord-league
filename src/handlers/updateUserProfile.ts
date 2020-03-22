import Joi from '@hapi/joi'
import * as express from 'express-async-router'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<db.UserReadModel>({
    discordId: Joi.string().required(),
    discordDiscriminator: Joi.string().required(),
    discordName: Joi.string().required(),
    discordAvatar: Joi.string().required(),
    permissions: Joi.number()
      .integer()
      .required(),
    preferredClanId: Joi.number()
      .integer()
      .optional(),
    jigokuName: Joi.string().optional(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>, res: express.Response) {
  if (!req.params.id) {
    res.status(400).send('No User ID was provided.')
    return
  }
  if (!req.user?.d_id) {
    res.status(401).send('You need to be logged in.')
    return
  }
  const requestUser = await db.getUser(req.user.d_id)
  if (requestUser.permissions !== 1 && req.user?.d_id !== req.params.id) {
    res.status(403).send('You cannot update this user.')
    return
  }
  const user = await db.updateUser(req.body)

  res.status(200).send(user)
}
