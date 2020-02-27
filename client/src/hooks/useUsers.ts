import { useEffect, useState } from 'react'
import axios from 'axios'

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
    axios.get('/api/user').then(resp => setUsers(resp.data))
  }, [])

  return users
}
