import { User } from './useUsers'
import { useAuthToken } from './useAuthToken'
import { useState, useEffect } from 'react'
import { request } from '../utils/request'

export function useCurrentUser(): User | null {
  const [user, setUser] = useState(null)
  useAuthToken()
  useEffect(() => {
    request.get('/api/user/current').then(resp => setUser(resp.data))
  }, [])

  return user
}
