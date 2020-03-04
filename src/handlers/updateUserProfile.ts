import Joi from '@hapi/joi'
import * as express from 'express-async-router'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<db.UserReadModel>({
    discordId: Joi.string().required(),
    discordDiscriminator: Joi.number().required(),
    discordName: Joi.string().required(),
    discordAvatar: Joi.string().required(),
    permissions: Joi.number().required(),
    preferedClan: Joi.string()
      .valid('', 'Crab', 'Crane', 'Dragon', 'Lion', 'Phoenix', 'Scorpion', 'Unicorn')
      .optional(),
    jigokuName: Joi.string().optional(),
  }),
}

export async function handler(req: ValidatedRequest<typeof schema>, res: express.Response) {
  if (!req.params.id) {
    res.status(400).send()
    return
  }
  if (req.user?.d_id !== req.params.id) {
    res.status(403).send()
    return
  }
  const user = db.updateUser(req.body)

  res.status(200).send(user)
}
