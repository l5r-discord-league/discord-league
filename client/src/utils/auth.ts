const AUTH_TOKEN = 'discordLeagueToken'

export function setToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN, token)
}

export function unsetToken() {
  window.localStorage.removeItem(AUTH_TOKEN)
}

export function getToken(): string | null {
  return window.localStorage.getItem(AUTH_TOKEN)
}
