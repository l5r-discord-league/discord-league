import { MatchData } from '@dl/api'
import { useEffect, useState, Dispatch, SetStateAction } from 'react'

import { request } from '../utils/request'
import { Tournament } from './useTournaments'
import { ParticipantWithUserData } from './useTournamentParticipants'

export interface TournamentWithMatches {
  tournament: Tournament
  matches: MatchData[]
  participants: ParticipantWithUserData[]
}

export function useMatchesForUser(
  discordId: string | undefined
): [TournamentWithMatches[], Dispatch<SetStateAction<TournamentWithMatches[]>>, boolean, string] {
  const [TournamentWithMatches, setTournamentsWithMatches] = useState<TournamentWithMatches[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (discordId) {
      setIsLoading(true)
      setError('')
      request
        .get('/api/user/' + discordId + '/matches')
        .then((resp) => {
          setTournamentsWithMatches(resp.data)
        })
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false))
    }
  }, [discordId])

  return [TournamentWithMatches, setTournamentsWithMatches, isLoading, error]
}
