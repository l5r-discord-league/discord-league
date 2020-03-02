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
import { useUser } from '../hooks/useUser'
import { useParams } from 'react-router-dom'

export function UserProfile() {
  const { id } = useParams()

  const [user, error, isLoading] = useUser(id)

  if (isLoading) {
    return <h4>Loading...</h4>
  }
  if (error) {
    return <div>Error while retrieving data: {error}</div>
  }
  return user ? (
    <Container>
      <h4>
        Profile of {user.discordName}#{user.discordDiscriminator}
      </h4>
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
            <UserRow user={user} key={user.discordId} />
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  ) : (
    <div>No data found.</div>
  )
}
