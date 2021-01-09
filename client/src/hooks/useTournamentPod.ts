import { useEffect, useState } from 'react'
import { request } from '../utils/request'
import { Pod } from './useTournamentPods'

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
