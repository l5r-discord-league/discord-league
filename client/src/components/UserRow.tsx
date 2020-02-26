import React from 'react'
import { Card, Container, Typography, Avatar, Grid } from '@material-ui/core'
import { UserRecord } from '../views/UserView'

export function UserRow(props: { user: UserRecord }): JSX.Element {
  return (
    <Container>
      <Card>
        <Grid container alignItems="center" justify="space-evenly">
          <Grid item>
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
          </Grid>
          <Grid item>
            <Typography>
              {props.user.discord_name}#{props.user.discord_discriminator} (
              {props.user.permissions === 1 ? 'Admin' : 'Player'})
            </Typography>
          </Grid>
          <Grid item>Id: {props.user.discord_id}</Grid>
        </Grid>
      </Card>
    </Container>
  )
}
