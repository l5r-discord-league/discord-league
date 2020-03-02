import React from 'react'
import { TableRow, TableCell } from '@material-ui/core'
import { User } from '../hooks/useUsers'
import UserAvatar from './UserAvatar'
import { useHistory } from 'react-router-dom'

export function UserRow(props: { user: User }) {
  const history = useHistory()

  function navigate(to: string) {
    history.push(to)
  }

  return (
    <TableRow key={props.user.discordId} onClick={() => navigate('/user/' + props.user.discordId)}>
      <TableCell component="th" scope="row">
        <UserAvatar user={props.user} />
      </TableCell>
      <TableCell>
        {props.user.discordName}#{props.user.discordDiscriminator}
      </TableCell>
      <TableCell>{props.user.discordId}</TableCell>
      <TableCell>{props.user.permissions === 1 ? 'Admin' : 'Player'}</TableCell>
      <TableCell />
    </TableRow>
  )
}
