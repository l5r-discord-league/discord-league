import React from 'react'
import { useTournament } from '../hooks/useTournament'
import { useParams } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Grid,
} from '@material-ui/core'
import { TournamentParticipationPanel } from '../components/TournamentParticipationPanel'
import { TournamentAdminPanel } from '../components/TournamentAdminPanel'
import { CountdownTimer } from '../components/CountdownTimer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
    },
    headline: {
      padding: theme.spacing(1),
    },
  })
)

export function TournamentDetailView() {
  const { id } = useParams()
  const [tournament, setTournament, requestError, isLoading] = useTournament(id)
  const classes = useStyles()

  if (requestError) {
    return <h5>Error while retrieving tournament: {requestError}</h5>
  }
  if (isLoading) {
    return <h5>Loading...</h5>
  }
  if (tournament) {
    const startDate = new Date(tournament.startDate)
    return (
      <div>
        <Container>
          <Paper>
            <Container className={classes.headline}>
              <Typography variant="h5" align="center">
                Details of Tournament "{tournament.name}"
              </Typography>
              <Typography variant="subtitle1" align="center">
                {tournament.description
                  ? `Description: ${tournament.description}`
                  : 'No description provided.'}
              </Typography>
              <Container>
                <Grid container justify="space-between">
                  <Grid item xs={6}>
                    <Typography>Status: {tournament.statusId.toUpperCase()}</Typography>
                    <Typography>
                      Start Date: {startDate.toLocaleDateString()} (
                      <CountdownTimer
                        deadline={startDate}
                        timeOutMessage="Registration period is over!"
                      />
                      )
                    </Typography>
                  </Grid>
                </Grid>
              </Container>
            </Container>
            <TournamentParticipationPanel tournament={tournament} />
            <TournamentAdminPanel tournament={tournament} onTournamentUpdate={setTournament} />
          </Paper>
        </Container>
      </div>
    )
  }

  return <div>No data found.</div>
}
