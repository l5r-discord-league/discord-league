import React from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from '@material-ui/core'

import { UserRow } from '../components/UserRow'
import { useUsers } from '../hooks/useUsers'

export function UserView(): JSX.Element {
  const users = useUsers()

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
            <UserRow user={user} key={user.discordId} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
