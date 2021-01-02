import { useEffect, useState, SetStateAction, Dispatch } from 'react'
import { request } from '../utils/request'
import { Tournament } from './useTournaments'

export function useTournament(
  id: string | undefined
): [Tournament | undefined, Dispatch<SetStateAction<Tournament | undefined>>, string, boolean] {
  const [tournament, setTournament] = useState<Tournament>()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setError('')
    setIsLoading(true)
    request
      .get('/api/tournament/' + id)
      .then((resp) => setTournament(resp.data))
      .catch((error) => setError(error.response))
      .finally(() => setIsLoading(false))
  }, [id])

  return [tournament, setTournament, error, isLoading]
}
