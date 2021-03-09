import { Tournament$findById, Bracket } from '@dl/api'
import { Request, Response } from 'express'
import * as db from '../gateways/storage'
import { toTournament } from '../tournaments'

function sortBrackets(brackets: Bracket[]) {
  return brackets.sort((a) => (a.bracket === 'goldCup' ? -1 : 1))
}

export async function handler(
  req: Request<Tournament$findById['request']['params']>,
  res: Response<Tournament$findById['response']>
): Promise<void> {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.sendStatus(400)
    return
  }

  const tournamentRecord = await db.getTournament(tournamentId)
  if (!tournamentRecord) {
    res.sendStatus(404)
    return
  }

  const [participantRecords, podRecords, brackets] = await Promise.all([
    db.fetchParticipants(tournamentRecord.id),
    db.fetchTournamentPods(tournamentRecord.id),
    db.fetchBrackets(tournamentRecord.id),
  ])

  const matchRecords = await db.fetchMatchesForMultiplePods(podRecords.map((pod) => pod.id))
  const tournament = toTournament(tournamentRecord, podRecords, matchRecords, participantRecords)

  const pods = tournament.toPodResults()
  const podParticipants = pods.flatMap((pod) => pod.participants)
  const participants = participantRecords.map(
    (pr) =>
      podParticipants.find((pp) => pp.id === pr.id) ?? { ...pr, wins: 0, losses: 0, position: 0 }
  )

  res.status(200).send({
    tournament: { ...tournamentRecord, startDate: tournamentRecord.startDate.toJSON() },
    pods,
    brackets: sortBrackets(brackets),
    participants,
  })
}
