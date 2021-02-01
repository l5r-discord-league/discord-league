import { Request, Response } from 'express'
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { toTournament } from '../tournaments'

import * as db from '../gateways/storage'

function getParticipantIdsForMatches(matches: db.MatchRecordWithPodId[]): number[] {
  const participantIds: number[] = matches
    .map((match) => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB))
  return Array.from(new Set(participantIds))
}

export async function handler(
  req: Request<{ tournamentId: string }>,
  res: Response
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
  } else if (tournamentRecord.statusId !== 'group') {
    res.status(403).send('Tournament status incompatible with group stage cleanup')
    return
  }

  const pods = await db.fetchTournamentPods(tournamentId)
  const matches = await db.fetchMatchesForMultiplePods(pods.map((pod) => pod.id))
  const participantIds = getParticipantIdsForMatches(matches)
  const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)

  const tournament = toTournament(tournamentRecord, pods, matches, participants)
  const podResults = tournament.toPodResults()

  const { left: goldParticipantIds, right: silverParticipantIds } = pipe(
    podResults,
    A.chain((result) =>
      pipe(
        result.participants,
        A.filter(({ bracket }) => bracket === 'goldCup' || bracket === 'silverCup'),
        A.map(({ bracket, id }) => (bracket === 'goldCup' ? E.left(id) : E.right(id)))
      )
    ),
    A.separate
  )

  await Promise.all([
    db.updateTournament(tournamentId, { statusId: 'endOfGroup' }),
    db.updateParticipants(goldParticipantIds, { bracket: 'goldCup' }),
    db.updateParticipants(silverParticipantIds, { bracket: 'silverCup' }),
  ])

  res.sendStatus(200)
}
