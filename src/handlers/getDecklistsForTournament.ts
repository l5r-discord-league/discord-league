import { Request, Response } from 'express-serve-static-core'

import * as db from '../gateways/storage'

export async function handler(
  req: Request<{ tournamentId: string }>,
  res: Response
): Promise<void> {
  const tournament = await db.fetchTournament(parseInt(req.params.tournamentId, 10))
  if (tournament == null) {
    res.sendStatus(404)
    return
  }

  const decklists = await db.fetchTournamentDecklists(tournament.id, {
    isAdmin: req.user?.flags === 1,
    userDiscordId: req.user?.d_id ?? '',
  })

  res.status(200).send(decklists)
}
