import { PodResult, RankedParticipant, UserRowData } from '@dl/api'
import { useMemo } from 'react'
import { Grid, Container } from '@material-ui/core'
import { PodTable } from './PodTable'

export function TournamentPodPanel({
  pods,
  participants,
  users,
}: {
  pods: PodResult[]
  participants: RankedParticipant[]
  users: UserRowData[]
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
