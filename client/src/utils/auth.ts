const AUTH_TOKEN = 'discordLeagueToken'

const bearerToken = {
  tokenFromQueryParamsRegexp: /token=([^&]+)/,
  extractToken(): string | null {
    const match = document.location.search.match(this.tokenFromQueryParamsRegexp)
    return match ? match[1] : null
  },
}

export function captureToken() {
  const token = bearerToken.extractToken()
  if (token) {
    setToken(token)
  }
}

export function setToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN, token)
}

export function unsetToken() {
  window.localStorage.removeItem(AUTH_TOKEN)
}

export function getToken(): string | null {
  return window.localStorage.getItem(AUTH_TOKEN)
}
