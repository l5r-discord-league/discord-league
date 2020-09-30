import { Request, Response } from 'express-serve-static-core'

import * as db from '../gateways/storage'

export async function handler(req: Request<{ tournamentId: string }>, res: Response) {
  const tournament = await db.fetchTournament(parseInt(req.params.tournamentId, 10))
  if (tournament == null) {
    return res.sendStatus(404)
  }

  const decklists = await db.fetchTournamentDecklists(tournament.id)

  res.status(200).send(decklists)
}
