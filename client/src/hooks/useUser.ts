import { useEffect, useState, SetStateAction, Dispatch } from 'react'
import { request } from '../utils/request'
import { User } from './useUsers'

export function useUser(
  id: string | undefined
): [User | undefined, Dispatch<SetStateAction<User | undefined>>, string, boolean] {
  const [user, setUser] = useState<User>()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setError('')
    setIsLoading(true)
    request
      .get('/api/user/' + id)
      .then(resp => setUser(resp.data))
      .catch(error => setError(error.response))
      .finally(() => setIsLoading(false))
  }, [id])

  return [user, setUser, error, isLoading]
}
