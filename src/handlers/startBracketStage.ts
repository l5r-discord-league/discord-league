import * as express from 'express'

import { processBrackets } from '../brackets'
import * as db from '../gateways/storage'
import { toTournament } from '../tournaments'

export async function handler(
  req: express.Request<{ tournamentId: string }>,
  res: express.Response
): Promise<void> {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.sendStatus(400)
    return
  }

  const tournamentRecord = await db.fetchTournament(tournamentId)
  if (tournamentRecord == null) {
    res.sendStatus(404)
    return
  } else if (tournamentRecord.statusId !== 'endOfGroup') {
    res.status(403).send('Tournament status cannot be changed to bracket status')
    return
  }

  await Promise.all([
    db.lockTournamentDecklists(tournamentId),
    db.updateTournament(tournamentId, { statusId: 'bracket' }),
  ])

  const [decklists, podRecords] = await Promise.all([
    db.fetchTournamentDecklists(tournamentRecord.id, { isAdmin: true }),
    db.fetchTournamentPods(tournamentRecord.id),
  ])

  const matchRecords = await db.fetchMatchesForMultiplePods(podRecords.map((pod) => pod.id))
  const participantRecords = await db.fetchMultipleParticipantsWithUserData(
    matchRecords.flatMap((match) => [match.playerAId, match.playerBId])
  )

  const tournament = toTournament(tournamentRecord, podRecords, matchRecords, participantRecords)
  const podResults = tournament.toPodResults()

  await processBrackets(tournamentRecord, podResults, decklists)

  res.sendStatus(200)
}
