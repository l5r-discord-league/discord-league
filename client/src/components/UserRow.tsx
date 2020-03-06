import React from 'react'
import { TableRow, TableCell } from '@material-ui/core'
import { User } from '../hooks/useUsers'
import UserAvatar from './UserAvatar'
import { useHistory } from 'react-router-dom'
import { UserChip } from './UserChip'

export function UserRow(props: { user: User }) {
  const history = useHistory()

  function navigateToProfile() {
    history.push('/user/' + props.user.discordId)
  }

  return (
    <TableRow key={props.user.discordId} hover onClick={navigateToProfile}>
      <TableCell component="th" scope="row">
        <UserAvatar user={props.user} />
      </TableCell>
      <TableCell>
        {props.user.discordName}#{props.user.discordDiscriminator}
      </TableCell>
      <TableCell>{props.user.discordId}</TableCell>
      <TableCell>
        <UserChip user={props.user} />
      </TableCell>
    </TableRow>
  )
}
