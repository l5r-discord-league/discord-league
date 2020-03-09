import React from 'react'
import {
  Card,
  Typography,
  Grid,
  createStyles,
  makeStyles,
  Theme,
  Divider,
  Button,
} from '@material-ui/core'
import { Tournament } from '../hooks/useTournaments'
import { CountdownTimer, isInPast } from '../utils/CountdownTimer'

export enum TournamentStatus {
  Upcoming,
  GroupStage,
  DeckSubmission,
  BracketStage,
  Finished,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: theme.spacing(2),
      position: 'relative',
    },
    button: {
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  })
)

export function TournamentRow(props: { tournament: Tournament }) {
  const classes = useStyles()
  const startDate = new Date(props.tournament.startDate)

  return (
    <Grid item>
      <Card className={classes.card}>
        <Grid container justify="space-between">
          <Grid item xs={6}>
            <Typography variant="h5">
              {props.tournament.name} (Status: {props.tournament.statusId.toUpperCase()})
            </Typography>
            {props.tournament.description ? (
              <Typography>Description: {props.tournament.description}</Typography>
            ) : (
              <Typography>No description provided.</Typography>
            )}
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={5}>
            <Typography variant="h6">Start Date: {startDate.toLocaleDateString()}</Typography>
            <CountdownTimer deadline={startDate} timeOutMessage="Registration period is over!" />
          </Grid>
        </Grid>
        {!isInPast(startDate) && (
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => window.alert('TODO')}
          >
            Sign Up
          </Button>
        )}
      </Card>
    </Grid>
  )
}
