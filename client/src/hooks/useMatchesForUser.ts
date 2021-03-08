import { User$findMatches } from '@dl/api'

import { createMapersmithHook } from '../utils/createMappersmithHook'
import { api } from '../api'

type Response = User$findMatches['response']
type UserId = User$findMatches['request']['params']['userId']

export const useMatchesForUser = createMapersmithHook<Response, UserId>(
  api.User.findMatches,
  (userId) => ({ userId })
)
