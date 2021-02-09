import { Request, Response } from 'express'
import * as db from '../gateways/storage'
import { toTournament } from '../tournaments'

type Input = {
  id: string
}
interface Participant {
  id: number
  userId: string
  clanId: number
  dropped: boolean
  discordAvatar: string
  discordDiscriminator: string
  discordId: string
  discordName: string
  bracket: 'silverCup' | 'goldCup' | null
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  wins: number
  losses: number
  position: number
}
interface Bracket {
  id: number
  tournamentId: number
  bracket: 'silverCup' | 'goldCup'
  challongeTournamentId: number
  url: string
}
interface Output {
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
  pods: Array<{
    id: number
    name: string
    tournamentId: number
    timezoneId: number
    matches: Array<{
      id: number
      createdAt: Date
      updatedAt: Date
      playerAId: number
      playerBId: number
      winnerId?: number
      firstPlayerId?: number
      victoryConditionId?: number
      deckAClanId?: number
      deckARoleId?: number
      deckASplashId?: number
      deckBClanId?: number
      deckBRoleId?: number
      deckBSplashId?: number
      deadline?: Date
      podId: number
    }>
    participants: number[]
  }>
  brackets: Bracket[]
  participants: Participant[]
}

function sortBrackets(brackets: Bracket[]) {
  return brackets.sort((a) => (a.bracket === 'goldCup' ? -1 : 1))
}

export async function handler(req: Request<Input>, res: Response<Output>): Promise<void> {
  const tournamentRecord = await db.getTournament(req.params.id)
  if (!tournamentRecord) {
    res.status(404).send()
    return
  }

  const [participantRecords, podRecords, brackets] = await Promise.all([
    db.fetchParticipants(tournamentRecord.id),
    db.fetchTournamentPods(tournamentRecord.id),
    db.fetchBrackets(tournamentRecord.id),
  ])

  const matchRecords = await db.fetchMatchesForMultiplePods(podRecords.map((pod) => pod.id))
  const tournament = toTournament(tournamentRecord, podRecords, matchRecords, participantRecords)

  const podsRaw = tournament.toPodResults()
  const pods = podsRaw.map((pod) => ({ ...pod, participants: pod.participants.map((p) => p.id) }))
  const podParticipants = podsRaw.flatMap((pod) => pod.participants)
  const participants = participantRecords.map(
    (pr) =>
      podParticipants.find((pp) => pp.id === pr.id) ?? { ...pr, wins: 0, losses: 0, position: 0 }
  )

  res.status(200).send({
    tournament: tournamentRecord,
    pods,
    brackets: sortBrackets(brackets),
    participants,
  })
}
