import * as express from 'express-serve-static-core'
import * as db from '../gateways/storage'

export async function handler(req: express.Request, res: express.Response) {
  const matchId = parseInt(req.params.id, 10)
  if (isNaN(matchId)) {
    res.status(400).send('No valid match ID was provided.')
    return
  }
  if (!req.user?.d_id) {
    res.status(401).send('You need to be logged in.')
    return
  }
  const match = await db.fetchMatch(matchId)
  if (!match) {
    res.status(404).send('Match could not be found.')
    return
  }
  await db.deleteMatchReport(matchId)
  const updatedMatch = await db.fetchMatch(matchId)
  res.status(200).send(updatedMatch)
}
