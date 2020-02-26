import React from 'react'
import { Avatar, TableRow, TableCell } from '@material-ui/core'
import { UserRecord } from '../views/UserView'

export function UserRow(props: { user: UserRecord }): JSX.Element {
  return (
    <TableRow key={props.user.discord_id}>
      <TableCell component="th" scope="row">
        <Avatar
          src={
            'https://cdn.discordapp.com/avatars/' +
            props.user.discord_id +
            '/' +
            props.user.discord_avatar +
            '.png'
          }
          style={{
            margin: 5,
          }}
        />
      </TableCell>
      <TableCell>
        {props.user.discord_name}#{props.user.discord_discriminator}
      </TableCell>
      <TableCell>{props.user.discord_id}</TableCell>
      <TableCell>{props.user.permissions === 1 ? 'Admin' : 'Player'}</TableCell>
      <TableCell />
    </TableRow>
  )
}
