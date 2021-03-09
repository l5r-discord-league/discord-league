import { createMapersmithHook } from '../utils/createMappersmithHook'
import { User$findAll, UserRowData } from '@dl/api'
import { api } from '../api'

export type RowUser = UserRowData

export function isAdmin(user?: { permissions: number }) {
  return user?.permissions === 1
}

export const useUsers = createMapersmithHook<User$findAll['response']>(api.User.findAll)
