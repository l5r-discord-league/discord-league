import React from 'react'
import { Typography, Divider, Grid, Container } from '@material-ui/core'
import { useTournamentPods } from '../hooks/useTournamentPods'
import { PodTable } from './PodTable'

export function TournamentPodPanel(props: { tournamentId: number }) {
  const [pods, isLoading, error] = useTournamentPods(props.tournamentId)

  if (isLoading) {
    return (
      <div>
        <Divider />
        <Typography variant="h6" align="center">
          Loading Tournament Pods...
        </Typography>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <Divider />
        <Typography variant="h6" align="center">
          Could not load tournament pods: {error}
        </Typography>
      </div>
    )
  }
  return (
    <Container>
      <Divider />
      <Typography variant="h6" align="center">
        Tournament Pods
      </Typography>
      <Grid container spacing={2}>
        {pods.map(pod => (
          <Grid item xs={12} lg={4} xl={3} key={pod.id}>
            <PodTable pod={pod} podLink />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
