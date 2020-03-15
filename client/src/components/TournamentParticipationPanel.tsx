import React from 'react'
import { Container, Typography, Divider, Grid } from '@material-ui/core'

export function TournamentParticipationPanel() {
  return (
    <Container>
      <Divider />
      <Typography variant="h6" align="center">
        Participants
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6} />
      </Grid>
    </Container>
  )
}
