import React from 'react'
import { useParams } from 'react-router-dom'
import { useTournamentPod } from '../hooks/useTournamentPod'
import {
  Container,
  Paper,
  Typography,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import { PodTable } from '../components/PodTable'
import { MatchCard } from '../components/MatchCard'
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headline: {
      padding: theme.spacing(1),
    },
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

export function PodDetailView() {
  const classes = useStyles()
  const { id } = useParams()
  const [pod, requestError, isLoading] = useTournamentPod(id)

  if (requestError) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          Error while retrieving pod: {requestError}
        </Typography>
      </Container>
    )
  }
  if (isLoading) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          Loading...
        </Typography>
      </Container>
    )
  }

  function findParticipantById(participantId: number): ParticipantWithUserData {
    const result = pod?.participants.find(participant => participant.id === participantId)
    if (!result) {
      throw Error('The participating user was not found.')
    }
    return result
  }

  if (pod) {
    return (
      <Container className={classes.headline}>
        <Paper>
          <Typography variant="h5" align="center">
            Details for Pod {pod.name}
          </Typography>
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PodTable pod={pod} />
              </Grid>
              <Grid item xs={12}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="finished-games-content"
                    id="finished-games-header"
                  >
                    <Typography>Matches</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.expansionBody}>
                    <Grid container spacing={1}>
                      {pod.matches.map(match => (
                        <Grid item xs={12} md={6} lg={4} key={match.id}>
                          <MatchCard
                            key={match.id}
                            match={match}
                            participantA={findParticipantById(match.playerAId)}
                            participantB={findParticipantById(match.playerBId)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant="h5" align="center">
        No data found.
      </Typography>
    </Container>
  )
}
