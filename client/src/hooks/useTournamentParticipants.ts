import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { request } from '../utils/request'

export interface ParticipantWithUserData {
  id: number
  userId: string
  clanId: number
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  discordName: string
  discordAvatar: string
  discordDiscriminator: string
  dropped: boolean
}

export function useTournamentParticipants(
  id: number
): [
  ParticipantWithUserData[],
  Dispatch<SetStateAction<ParticipantWithUserData[]>>,
  boolean,
  string
] {
  const [participants, setParticipants] = useState<ParticipantWithUserData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setIsLoading(true)
    setError('')
    request
      .get('/api/tournament/' + id + '/participant')
      .then(resp => setParticipants(resp.data))
      .catch(error => setError(error))
      .finally(() => setIsLoading(false))
  }, [id])

  return [participants, setParticipants, isLoading, error]
}
