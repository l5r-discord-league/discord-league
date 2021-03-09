import { User$findCurrent } from '@dl/api'

import { api } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export const useCurrentUser = createMapersmithHook<User$findCurrent['response']>(
  api.User.getCurrent
)
