import { useEffect, useState } from 'react'
import { request } from '../utils/request'
import { ParticipantWithUserData } from './useTournamentParticipants'

interface Match {
  id: number
  createdAt: Date
  updatedAt: Date
  deadline: Date
  playerAId: number
  playerBId: number
  winnerId?: number
  firstPlayerId?: number
  victoryConditionId?: number
  deckAClanId: number
  deckARoleId?: number
  deckASplashId?: number
  deckBClanId: number
  deckBRoleId?: number
  deckBSplashId?: number
}

interface Pod {
  id: number
  name: string
  timezoneId: number
  tournamentId: number
  matches: Match[]
  participants: ParticipantWithUserData[]
  records: Array<{ participantId: number; wins: number; losses: number; dropped: boolean }>
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
      .then(resp => setPod(resp.data))
      .catch(error => setError(error))
      .finally(() => setIsLoading(false))
  }, [podId])

  return [pod, isLoading, error]
}
