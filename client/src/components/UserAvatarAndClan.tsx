import React from 'react'
import { Avatar, makeStyles, Theme, createStyles, Typography } from '@material-ui/core'
import { ClanMon } from './ClanMon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginLeft: -10,
    },
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    userName: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
)

function avatarUrl(userId: string, userAvatar: string): string {
  return `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.png`
}

export function UserAvatarAndClan({
  user: { clanId, discordAvatar, discordDiscriminator, discordName, userId },
  dropped = false,
}: {
  user: {
    userId: string
    discordAvatar: string
    discordName: string
    discordDiscriminator: string
    clanId: number
  }
  dropped?: boolean
}) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ClanMon clanId={clanId} small />
      <Avatar src={avatarUrl(userId, discordAvatar)} className={classes.avatar} />
      <Typography className={classes.userName}>
        {`${dropped ? '💧 ' : ''}${discordName}#${discordDiscriminator}`}
      </Typography>
    </div>
  )
}
