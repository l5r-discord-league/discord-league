import * as express from 'express-serve-static-core'
import * as db from '../gateways/storage'

export async function handler(
  req: express.Request<Record<'participantId', string>>,
  res: express.Response
): Promise<void> {
  const participantId = parseInt(req.params.participantId, 10)
  if (isNaN(participantId)) {
    res.status(400).send('No valid Participant ID was provided.')
    return
  }
  if (!req.user?.d_id) {
    res.status(401).send('You need to be logged in.')
    return
  }
  const requestUser = await db.getUser(req.user.d_id)

  const participant = await db.fetchParticipant(participantId)
  if (!participant) {
    res.status(404).send('Participant could not be found.')
    return
  }
  if (requestUser.permissions !== 1 && req.user?.d_id !== participant.userId) {
    res.status(403).send('You cannot drop this participations')
    return
  }

  await db.dropParticipant(participantId)

  res.status(204).send()
}
