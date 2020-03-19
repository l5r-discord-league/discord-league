import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { request } from '../utils/request'
import { ParticipantWithUserData } from './useTournamentParticipants'
import { Match } from './useTournamentPods'

export function useMatchesForUser(
  discordId: string | undefined
): [Match[], Dispatch<SetStateAction<Match[]>>, ParticipantWithUserData[], boolean, string] {
  const [participants, setParticipants] = useState<ParticipantWithUserData[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (discordId) {
      setIsLoading(true)
      setError('')
      request
        .get('/api/user/' + discordId + '/matches')
        .then(resp => {
          setMatches(resp.data.matches)
          setParticipants(resp.data.participants)
        })
        .catch(error => setError(error))
        .finally(() => setIsLoading(false))
    }
  }, [discordId])

  return [matches, setMatches, participants, isLoading, error]
}
