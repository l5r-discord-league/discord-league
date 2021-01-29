import axios from 'axios'
import { getToken, unsetToken } from './auth'

export const request = axios

axios.interceptors.request.use(function (config) {
  const authToken = getToken()
  if (typeof authToken === 'string') {
    config.headers = { ...config.headers, Authorization: `Bearer ${authToken}` }
  }
  return config
})

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401) {
      unsetToken()
    }
    return Promise.reject(error.response)
  }
)
