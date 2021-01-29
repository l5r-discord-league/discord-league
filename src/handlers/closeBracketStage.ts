import { Request, Response } from 'express'

import * as db from '../gateways/storage'

export async function handler(
  req: Request<{ tournamentId: string }>,
  res: Response
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
  } else if (tournament.statusId !== 'bracket') {
    res.status(403).send('Tournament status incompatible with bracket stage cleanup')
    return
  }

  await db.updateTournament(tournamentId, { statusId: 'finished' })

  res.sendStatus(200)
}
