import * as express from 'express-async-router'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.status(400).send()
    return
  }
  const participants = await db.fetchParticipantsWithUserData(tournamentId)

  res.status(200).send(participants)
}
