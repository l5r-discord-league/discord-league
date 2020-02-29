import { useEffect, useState } from 'react'
import { request } from '../utils/request'

export interface User {
  discordId: string
  discordName: string
  discordDiscriminator: string
  discordAvatar: string
  discordAccessToken: string
  discordRefreshToken: string
  permissions: number
  createdAt: Date
  updatedAt: Date
}

export function useUsers(): User[] {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    request.get('/api/user').then(resp => setUsers(resp.data))
  }, [])

  return users
}
