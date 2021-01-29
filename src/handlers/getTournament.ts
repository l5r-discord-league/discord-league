import { Request, Response } from 'express'
import * as db from '../gateways/storage'
import { toTournament } from '../tournaments'

type Input = { id: string }
type Output = {
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
    participants: Array<{
      id: number
      userId: string
      clanId: number
      dropped: boolean
      discordAvatar: string
      discordDiscriminator: string
      discordId: string
      discordName: string
      bracket: 'silverCup' | 'goldCup' | null
      wins: number
      losses: number
      position: number
    }>
  }>
  brackets: Array<{
    id: number
    tournamentId: number
    bracket: 'silverCup' | 'goldCup'
    challongeTournamentId: number
    url: string
  }>
}

function sortBrackets(
  brackets: Array<{
    id: number
    tournamentId: number
    bracket: 'silverCup' | 'goldCup'
    challongeTournamentId: number
    url: string
  }>
) {
  return brackets.sort((a, b) => (a.bracket === 'goldCup' ? -1 : 1))
}

export async function handler(req: Request<Input>, res: Response<Output>): Promise<void> {
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
  const brackets = await db.fetchBrackets(tournamentRecord.id)
  const tournament = toTournament(tournamentRecord, podRecords, matchRecords, participantRecords)

  res.status(200).send({
    tournament: tournamentRecord,
    pods: tournament.toPodResults(),
    brackets: sortBrackets(brackets),
  })
}
