import * as express from 'express'
import * as db from '../gateways/storage'
import { toTournament, PodResult } from '../tournaments'

type Request = express.Request<{ id: string }>
type Response = express.Response<{
  tournament: {
    id: number
    name: string
    startDate: Date
    statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
    typeId: 'monthly' | 'pod6'
    description?: string
    createdAt: Date
    updatedAt: Date
  }
  pods: PodResult[]
}>

export async function handler(req: Request, res: Response): Promise<void> {
  const tournamentRecord = await db.getTournament(req.params.id)
  if (!tournamentRecord) {
    res.status(404).send()
    return
  }
  const podRecords = await db.fetchTournamentPods(tournamentRecord.id)
  const matchRecords = await db.fetchMatchesForMultiplePods(podRecords.map((pod) => pod.id))
  const participantRecords = await db.fetchMultipleParticipantsWithUserData(
    matchRecords.flatMap((match) => [match.playerAId, match.playerBId])
  )

  const tournament = toTournament(tournamentRecord, podRecords, matchRecords, participantRecords)

  res.status(200).send({ tournament: tournamentRecord, pods: tournament.toPodResults() })
}
