import React from 'react'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Container,
} from '@material-ui/core'

import { UserRow } from '../components/UserRow'
import { useUsers } from '../hooks/useUsers'

export function UserView(): JSX.Element {
  const users = useUsers()

  return (
    <Container>
      <h4>User List</h4>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Discord Name</TableCell>
              <TableCell>Discord ID</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <UserRow user={user} key={user.discordId} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
