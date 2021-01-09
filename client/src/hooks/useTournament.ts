import { useEffect, useState, SetStateAction, Dispatch } from 'react'
import { request } from '../utils/request'
import { Pod } from './useTournamentPods'
import { Tournament } from './useTournaments'

export function useTournament(
  id: string | undefined
): [Tournament | undefined, Dispatch<SetStateAction<Tournament | undefined>>, Pod[] | undefined, string, boolean] {
  const [tournament, setTournament] = useState<Tournament>()
  const [pods, setPods] = useState<Pod[]>()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setError('')
    setIsLoading(true)
    request
      .get('/api/tournament/' + id)
      .then((resp) => {
        setTournament(resp.data.tournament)
        setPods(resp.data.pods)
      })
      .catch((error) => setError(error.response))
      .finally(() => setIsLoading(false))
  }, [id])

  return [tournament, setTournament, pods, error, isLoading]
}
