import axios from 'axios'

const AUTH_TOKEN = 'discordLeagueToken'

export const request = axios

export function setToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN, token)
}

export function unsetToken() {
  window.localStorage.removeItem(AUTH_TOKEN)
}

axios.interceptors.request.use(function(config) {
  const authToken = window.localStorage.getItem(AUTH_TOKEN)
  if (typeof authToken === 'string') {
    config.headers = { ...config.headers, Authorization: `Bearer ${authToken}` }
  }
  return config
})

axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    if (error.response.status === 401) {
      unsetToken()
    }
    return Promise.reject(error)
  }
)
