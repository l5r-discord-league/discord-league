import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export async function handler(req: ValidatedRequest<typeof schema>, res: express.Response) {
  if (!req.params.tournamentId || !req.params.id) {
    res.status(400).send('No Tournament ID or Participation ID was provided.')
    return
  }
  if (!req.user?.d_id) {
    res.status(401).send('You need to be logged in.')
    return
  }
  const requestUser = await db.getUser(req.user.d_id)
  const participation = await db.fetchTournamentParticipant(req.params.id)
  if (!participation) {
    res.status(404).send('Participation could not be found.')
    return
  }
  if (requestUser.permissions !== 1 && req.user?.d_id !== participation.userId) {
    res.status(403).send('You cannot delete participations for this user.')
    return
  }
  await db.deleteParticipant(req.params.id)

  res.status(204).send()
}
