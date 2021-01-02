import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response): Promise<void> {
  if (!req.params.id) {
    res.status(400).send('Request parameter "id" has not been provided.')
    return
  }
  const tournament = await db.getTournament(req.params.id)
  if (!tournament) {
    res.status(404).send('There is not tournament for the id ' + req.params.id)
    return
  }
  if (tournament.statusId !== 'upcoming') {
    res.status(405).send('You can only delete a tournament during the UPCOMING stage.')
    return
  }
  const participants = await db.fetchParticipants(tournament.id)
  if (participants.length > 0) {
    res.status(405).send('You cannot delete a tournament while there are registrations for it.')
    return
  }
  await db.deleteTournament(req.params.id)
  res.status(204).send()
}
