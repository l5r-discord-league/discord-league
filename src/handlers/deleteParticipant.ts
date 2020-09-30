import * as express from 'express-serve-static-core'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  const participationId = parseInt(req.params.id, 10)
  if (isNaN(tournamentId) || isNaN(participationId)) {
    res.status(400).send('No valid Tournament ID or Participation ID was provided.')
    return
  }
  if (!req.user?.d_id) {
    res.status(401).send('You need to be logged in.')
    return
  }
  const requestUser = await db.getUser(req.user.d_id)

  const participant = await db.fetchParticipant(participationId)
  if (!participant) {
    res.status(404).send('Participant could not be found.')
    return
  }
  if (requestUser.permissions !== 1 && req.user?.d_id !== participant.userId) {
    res.status(403).send('You cannot delete participations for this user.')
    return
  }
  await db.deleteParticipant(participationId)

  res.status(204).send()
}
