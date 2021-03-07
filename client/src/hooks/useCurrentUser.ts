import { User$findCurrent } from '@dl/api'
import { useState, useEffect } from 'react'

import { api } from '../api'
import { setToken } from '../utils/auth'

const bearerToken = {
  tokenFromQueryParamsRegexp: /token=([^&]+)/,
  extractToken(): string | null {
    const match = document.location.search.match(this.tokenFromQueryParamsRegexp)
    return match ? match[1] : null
  },
}

export function useCurrentUser(): User$findCurrent['response'] | undefined {
  const [user, setUser] = useState<User$findCurrent['response']>()
  const token = bearerToken.extractToken()
  if (token) {
    setToken(token)
  }

  useEffect(() => {
    api.User.getCurrent().then((response) => setUser(response.data<User$findCurrent['response']>()))
  }, [])

  return user
}
