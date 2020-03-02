import React from 'react'
import { Avatar } from '@material-ui/core'
import { User } from '../hooks/useUsers'

function avatarUrl(user: User): string {
  return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`
}

export default function UserAvatar(props: { user: User }) {
  return <Avatar src={avatarUrl(props.user)} />
}
