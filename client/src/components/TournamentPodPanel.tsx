import React from 'react'
import { Typography, Divider, Grid, Container } from '@material-ui/core'
import { PodTable } from './PodTable'
import { Tournament$findById } from '../api'

export function TournamentPodPanel(props: { pods: Tournament$findById['pods'] }) {
  return (
    <Container>
      <Divider />
      <Typography variant="h6" align="center">
        Tournament Pods
      </Typography>
      <Grid container spacing={2}>
        {props.pods.map((pod) => (
          <Grid item xs={12} md={6} key={pod.id}>
            <PodTable pod={pod} podLink />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
