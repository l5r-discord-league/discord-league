import { setToken, getToken } from '../utils/request'

const bearerToken = {
  tokenFromQueryParamsRegexp: /token=([^&]+)/,
  extractToken(): string | null {
    const match = document.location.search.match(this.tokenFromQueryParamsRegexp)
    return match ? match[1] : null
  },
}

export function useAuthToken(): string | null {
  let token = bearerToken.extractToken()
  if (token) {
    setToken(token)
  } else {
    token = getToken()
  }
  return token
}
