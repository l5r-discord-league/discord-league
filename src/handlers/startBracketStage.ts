import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'

export async function handler(
  req: express.Request<{ tournamentId: string }>,
  res: express.Response
) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    return res.sendStatus(400)
  }

  const tournament = await db.fetchTournament(tournamentId)
  if (tournament == null) {
    return res.sendStatus(404)
  } else if (tournament.statusId !== 'endOfGroup') {
    return res.status(403).send('Tournament status cannot be changed to bracket status')
  }

  await db.lockTournamentDecklists(tournamentId)
  await db.updateTournament(tournamentId, { statusId: 'bracket' })

  res.sendStatus(200)
}
