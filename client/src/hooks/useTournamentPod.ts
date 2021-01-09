import { useEffect, useState } from 'react'
import { request } from '../utils/request'
import { ParticipantWithUserData } from './useTournamentParticipants'

export type RankedParticipant = ParticipantWithUserData & {wins: number, losses: number, position: number}

export interface Pod {
  id: number
  name: string
  tournamentId: number
  timezoneId: number
  matches: Match[]
  participants: RankedParticipant[]
  records: Array<{ participantId: number; wins: number; losses: number; dropped: boolean }>
}

export interface Match {
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
}

export function useTournamentPod(podId: string | undefined): [Pod | undefined, boolean, string] {
  const [pod, setPod] = useState<Pod>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    setIsLoading(true)
    setError('')
    request
      .get('/api/pod/' + podId)
      .then((resp) => setPod(resp.data))
      .catch((error) => setError(error))
      .finally(() => setIsLoading(false))
  }, [podId])

  return [pod, isLoading, error]
}
