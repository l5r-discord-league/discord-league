import { PodResult, RankedParticipant } from '@dl/api'
import { useMemo } from 'react'
import { Grid, Container } from '@material-ui/core'
import { PodTable } from './PodTable'
import { RowUser } from '../hooks/useUsers'

export function TournamentPodPanel({
  pods,
  participants,
  users,
}: {
  pods: PodResult[]
  participants: RankedParticipant[]
  users: RowUser[]
}) {
  const prepedPods = useMemo(
    () =>
      pods.map((pod) => ({
        ...pod,
        participants: pod.participants.map(
          ({ id }) => participants.find((participant) => participant.id === id)!
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
