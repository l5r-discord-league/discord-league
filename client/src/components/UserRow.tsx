import React from 'react'
import { Avatar, TableRow, TableCell } from '@material-ui/core'
import { User } from '../hooks/useUsers'

function avatarUrl(user: User): string {
  return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`
}

export function UserRow(props: { user: User }) {
  return (
    <TableRow key={props.user.discordId}>
      <TableCell component="th" scope="row">
        <Avatar src={avatarUrl(props.user)} style={{ margin: 5 }} />
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
