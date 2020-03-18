import * as express from 'express-async-router'
import * as db from '../gateways/storage'
import {
  MatchRecordWithPodId,
  TournamentPodRecord,
  ParticipantWithUserData,
} from '../gateways/storage'

function getParticipantIdsForMatches(matches: MatchRecordWithPodId[]): number[] {
  const participantIds: number[] = matches
    .map(match => (match.playerAId && match.playerBId ? [match.playerAId, match.playerBId] : []))
    .reduce((matchA, matchB) => matchA.concat(matchB))
  return Array.from(new Set(participantIds))
}

function assembleResultPods(
  pods: TournamentPodRecord[],
  matches: MatchRecordWithPodId[],
  participants: ParticipantWithUserData[]
) {
  return pods.map(pod => {
    const matchesInPod = matches.filter(match => match.podId === pod.id)
    const participantsInPod = participants.filter(participant =>
      matchesInPod.some(
        match => match.playerAId === participant.id || match.playerBId === participant.id
      )
    )
    return {
      ...pod,
      matches: matchesInPod,
      participants: participantsInPod,
    }
  })
}

export async function handler(req: express.Request, res: express.Response) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.status(400).send()
    return
  }
  const pods = await db.fetchTournamentPods(tournamentId)
  const matches = await db.fetchMatchesForMultiplePods(pods.map(pod => pod.id))
  const participantIds = getParticipantIdsForMatches(matches)
  const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)

  const resultPods = assembleResultPods(pods, matches, participants)

  res.status(200).send(resultPods)
}
