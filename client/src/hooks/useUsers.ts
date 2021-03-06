import { useEffect, useState } from 'react'
import { request } from '../utils/request'
import { getClanForId } from '../utils/clanUtils'
import { createMapersmithHook } from '../utils/createMappersmithHook'
import { api } from '../api'
import { User$findAll } from '@dl/api'

export interface User {
  discordId: string
  discordName: string
  discordDiscriminator: string
  discordAvatar: string
  permissions: number
  preferredClanId?: number
  jigokuName?: string
}

export interface RowUser {
  user: User
  discordName: string
  jigokuName: string
  preferredClan: string
  userId: string
  role: string
}

export function isAdmin(user?: { permissions: number }) {
  return user?.permissions === 1
}

export const useUsers = createMapersmithHook<User$findAll['response'], undefined>(api.User.findAll)

// export function useUsers(): RowUser[] {

//   const [users, setUsers] = useState<User[]>([])

//   useEffect(() => {
//     request.get('/api/user').then((resp) => setUsers(resp.data))
//   }, [])

//   return users.map((user: User) => {
//     return {
//       user: user,
//       discordName: user.discordName + '#' + user.discordDiscriminator,
//       jigokuName: user.jigokuName || 'Not specified',
//       preferredClan: user.preferredClanId ? getClanForId(user.preferredClanId) : 'Not specified',
//       userId: user.discordId,
//       role: user.permissions === 1 ? 'Admin' : 'Player',
//     } as RowUser
//   })
// }
