import { User$findById } from '@dl/api'
import { api } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export type User = User$findById['response']

export const useUser = createMapersmithHook<User, string>(api.User.findById, (userId) => ({
  userId,
}))
