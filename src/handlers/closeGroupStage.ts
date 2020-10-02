import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { closePod } from '../pods'
import { PodResult, toPodResults } from '../utils/toPodResults'

function getParticipantIdsForMatches(matches: db.MatchRecordWithPodId[]): number[] {
  const participantIds: number[] = matches
    .map(match => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB))
  return Array.from(new Set(participantIds))
}

async function getFinalResults(pods: db.TournamentPodRecord[]): Promise<PodResult[]> {
  const matches = await db.fetchMatchesForMultiplePods(pods.map(pod => pod.id))
  const participants = await db.fetchMultipleParticipantsWithUserData(
    getParticipantIdsForMatches(matches)
  )
  return pods.map(pod => toPodResults(pod, matches, participants, true))
}

interface Score {
  id: number
  wins: number
  losses: number
}
function calculateFinalScore(podResults: PodResult[]): Score[] {
  return podResults.flatMap(({ participants, matches }) =>
    participants.map(({ dropped, id }) => {
      const wins = dropped
        ? 0
        : matches.filter(
            m =>
              (id === m.playerAId || id === m.playerBId) &&
              (id === m.winnerId || participants.find(p2 => m.winnerId === p2.id)?.dropped)
          ).length

      return { id, wins, losses: participants.length - 1 - wins }
    })
  )
}

export async function handler(
  req: express.Request<{ tournamentId: string }>,
  res: express.Response
) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    return res.sendStatus(400)
  }

  const tournament = await db.fetchTournament(tournamentId)
  if (tournament == null) {
    return res.sendStatus(404)
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

  const finalResults = await getFinalResults(pods)
  const finalScore = calculateFinalScore(finalResults)
  const cups = finalScore.reduce<{ gold: Score[]; silver: Score[] }>(
    (cups, score) => {
      if (score.losses <= 2) {
        cups.gold.push(score)
      } else if (score.losses <= 4) {
        cups.silver.push(score)
      }
      return cups
    },
    { gold: [], silver: [] }
  )

  res.status(200).send(cups)
}
