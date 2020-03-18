import { Container, Typography, Grid, makeStyles, Theme, createStyles } from '@material-ui/core'
import React from 'react'
import { getTournamentStatusForId } from '../utils/statusUtils'
import { CountdownTimer } from './CountdownTimer'
import { Tournament } from '../hooks/useTournaments'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headline: {
      padding: theme.spacing(1),
    },
  })
)

export function TournamentHeaderPanel(props: { tournament: Tournament }) {
  const classes = useStyles()
  const startDate = new Date(props.tournament.startDate)
  return (
    <Container className={classes.headline}>
      <Typography variant="h5" align="center">
        Details of Tournament "{props.tournament.name}"
      </Typography>
      <Typography variant="subtitle1" align="center">
        {props.tournament.description
          ? `Description: ${props.tournament.description}`
          : 'No description provided.'}
      </Typography>
      <Container>
        <Grid container justify="space-between">
          <Grid item xs={6}>
            <Typography>Status: {getTournamentStatusForId(props.tournament.statusId)}</Typography>
            {props.tournament.statusId === 'upcoming' && (
              <Typography>
                Start Date: {startDate.toLocaleDateString()} (
                <CountdownTimer
                  deadline={startDate}
                  timeOutMessage="Registration period is over!"
                />
                )
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Container>
  )
}
