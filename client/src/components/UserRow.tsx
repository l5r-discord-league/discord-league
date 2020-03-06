import React from 'react'
import { TableRow, TableCell } from '@material-ui/core'
import { User, isAdmin } from '../hooks/useUsers'
import UserAvatar from './UserAvatar'
import { useHistory } from 'react-router-dom'
import { UserChip } from './UserChip'

export function UserRow(props: { user: User }) {
  const history = useHistory()

  function navigateToProfile() {
    history.push('/user/' + props.user.discordId)
  }

  return (
    <TableRow key={props.user.discordId} hover>
      <TableCell component="th" scope="row" onClick={navigateToProfile}>
        <UserAvatar user={props.user} />
      </TableCell>
      <TableCell onClick={navigateToProfile}>
        {props.user.discordName}#{props.user.discordDiscriminator}
      </TableCell>
      <TableCell onClick={navigateToProfile}>{props.user.discordId}</TableCell>
      <TableCell onClick={navigateToProfile}>
        <UserChip user={props.user} />
      </TableCell>
    </TableRow>
  )
}
