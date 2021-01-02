import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'

export async function handler(
  req: express.Request<{ tournamentId: string }>,
  res: express.Response
): Promise<void> {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.sendStatus(400)
    return
  }

  const tournament = await db.fetchTournament(tournamentId)
  if (tournament == null) {
    res.sendStatus(404)
    return
  } else if (tournament.statusId !== 'endOfGroup') {
    res.status(403).send('Tournament status cannot be changed to bracket status')
    return
  }

  await Promise.all([
    db.lockTournamentDecklists(tournamentId),
    db.updateTournament(tournamentId, { statusId: 'bracket' }),
  ])

  res.sendStatus(200)
}
