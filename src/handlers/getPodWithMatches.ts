import { Pod$findById } from '@dl/api'
import { Request, Response } from 'express'
import * as db from '../gateways/storage'
import { toTournament } from '../tournaments'

export async function handler(
  req: Request<Pod$findById['request']['params']>,
  res: Response<Pod$findById['response']>
): Promise<void> {
  const podId = parseInt(req.params.podId, 10)
  if (isNaN(podId)) {
    res.status(400).send()
    return
  }

  const podRecord = await db.fetchPod(podId)
  if (!podRecord) {
    res.status(404).send()
    return
  }

  const tournamentRecord = await db.fetchTournament(podRecord.tournamentId)
  if (!tournamentRecord) {
    res.status(404).send()
    return
  }

  const matchRecords = await db.fetchMatchesForMultiplePods([podRecord.id])
  const participantRecords = await db.fetchMultipleParticipantsWithUserData(
    matchRecords.flatMap((match) => [match.playerAId, match.playerBId])
  )

  const tournament = toTournament(tournamentRecord, [podRecord], matchRecords, participantRecords)
  const [podResult] = tournament.toPodResults()

  res.status(200).send(podResult)
}
