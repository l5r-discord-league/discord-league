import { User } from './useUsers'
import { setToken, request } from '../utils/request'
import { useState, useEffect } from 'react'

const bearerToken = {
  tokenFromQueryParamsRegexp: /token=([^&]+)/,
  extractToken(): string | null {
    const match = document.location.search.match(this.tokenFromQueryParamsRegexp)
    return match ? match[1] : null
  },
}

export function useCurrentUser(): User | undefined {
  const [user, setUser] = useState<User>()
  const token = bearerToken.extractToken()
  if (token) {
    setToken(token)
  }
  useEffect(() => {
    request.get('/api/user/current').then(resp => setUser(resp.data))
  }, [])

  return user
}
