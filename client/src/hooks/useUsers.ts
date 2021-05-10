import { createMapersmithHook } from '../utils/createMappersmithHook'
import { User$findAll } from '@dl/api'
import { api } from '../api'

export function isAdmin(user?: { permissions: number }) {
  return user?.permissions === 1
}

export const useUsers = createMapersmithHook<User$findAll['response']>(api.User.findAll)
