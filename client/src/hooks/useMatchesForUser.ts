import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { request } from '../utils/request'
import { ParticipantWithUserData } from './useTournamentParticipants'
import { Match } from './useTournamentPod'
import { Tournament } from './useTournaments'

export interface TournamentWithMatches {
  tournament: Tournament
  matches: Match[]
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
