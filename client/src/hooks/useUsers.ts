import { useEffect, useState } from 'react'
import { request } from '../utils/request'

export interface User {
  discordId: string
  discordName: string
  discordDiscriminator: string
  discordAvatar: string
  permissions: number
  preferredClanId?: number
  jigokuName?: string
}

export function useUsers(): User[] {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    request.get('/api/user').then(resp => setUsers(resp.data))
  }, [])

  return users
}
