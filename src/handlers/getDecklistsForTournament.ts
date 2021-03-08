import { Decklist$findAllForTournament } from '@dl/api'
import { Request, Response } from 'express'

import * as db from '../gateways/storage'

export async function handler(
  req: Request<Decklist$findAllForTournament['request']['params']>,
  res: Response<Decklist$findAllForTournament['response']>
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
  }

  const decklists = await db.fetchTournamentDecklists(tournament.id, {
    isAdmin: req.user?.flags === 1,
    userDiscordId: req.user?.d_id ?? '',
  })

  res.status(200).send(decklists)
}
