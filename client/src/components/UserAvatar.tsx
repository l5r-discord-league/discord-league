import React from 'react'
import { Avatar, makeStyles, Theme, createStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    medium: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    userName: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    inverted: {
      alignContent: 'flex-end',
    },
  })
)

function avatarUrl(userId: string, userAvatar: string): string {
  return `https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.png`
}

export default function UserAvatar(props: {
  userId: string
  userAvatar: string
  userName?: string
  large?: boolean
  small?: boolean
}) {
  const classes = useStyles()
  const size = props.large ? classes.large : props.small ? classes.small : classes.medium

  return (
    <div className={classes.root}>
      <Avatar src={avatarUrl(props.userId, props.userAvatar)} className={size} />

      {props.userName ? (
        <Typography className={classes.userName}>{' ' + props.userName}</Typography>
      ) : (
        <span />
      )}
    </div>
  )
}
