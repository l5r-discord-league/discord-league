import React, { useState, useEffect } from 'react'
import { UserRow } from '../components/UserRow'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@material-ui/core'
import axios from 'axios'

export interface UserRecord {
  discord_id: string
  discord_name: string
  discord_discriminator: string
  discord_avatar: string
  discord_access_token: string
  discord_refresh_token: string
  permissions: number
  created_at: Date
  updated_at: Date
}

export function UserView(): JSX.Element {
  const [users, setUsers] = useState<UserRecord[]>([])

  useEffect(() => {
    axios.get('/api/user').then(resp => setUsers(resp.data))
  }, [])
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Discord Name</TableCell>
            <TableCell>Discord ID</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <UserRow user={user} key={user.discord_id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
