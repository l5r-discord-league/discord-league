import React, { useMemo } from 'react'
import { Grid, Container } from '@material-ui/core'
import { PodTable } from './PodTable'
import { Participant, Tournament$findById } from '../api'
import { RowUser } from '../hooks/useUsers'

export function TournamentPodPanel({
  pods,
  participants,
  users,
}: {
  pods: Tournament$findById['pods']
  participants: Participant[]
  users: RowUser[]
}) {
  const prepedPods = useMemo(
    () =>
      pods.map((pod) => ({
        ...pod,
        participants: pod.participants.map(
          (id) => participants.find((participant) => participant.id === id)!
        ),
      })),
    [pods, participants]
  )
  return (
    <Container>
      <Grid container spacing={2}>
        {prepedPods.map((pod) => (
          <Grid item xs={12} md={6} key={pod.id}>
            <PodTable pod={pod} podLink users={users} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
