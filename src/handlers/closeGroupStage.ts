import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { closePod } from '../pods'
import { toPodResults } from '../utils/toPodResults'

function getParticipantIdsForMatches(matches: db.MatchRecordWithPodId[]): number[] {
  const participantIds: number[] = matches
    .map(match => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB))
  return Array.from(new Set(participantIds))
}

export async function handler(
  req: express.Request<{ tournamentId: string }>,
  res: express.Response
) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    return res.status(400).send()
  }

  const tournament = await db.fetchTournament(tournamentId)
  if (tournament == null) {
    return res.status(404).send()
  } else if (tournament.statusId !== 'group') {
    return res.status(403).send('Tournament status incompatible with group stage cleanup')
  }

  const pods = await db.fetchTournamentPods(tournamentId)
  const matches = await db.fetchMatchesForMultiplePods(pods.map(pod => pod.id))
  const participantIds = getParticipantIdsForMatches(matches)
  const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)

  const playersToDrop = pods
    .map(pod => toPodResults(pod, matches, participants, false))
    .flatMap(p => closePod(p.participants, p.matches).drop)

  await Promise.all(playersToDrop.map(db.dropParticipant))
  await db.updateTournament(tournamentId, { statusId: 'endOfGroup' })

  res.status(200).send()
}
