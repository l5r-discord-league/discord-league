import { Container, Typography, makeStyles, Theme, createStyles } from '@material-ui/core'
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
      <Typography variant="h3" align="center">
        {props.tournament.name}
      </Typography>
      <Typography variant="subtitle1" align="center">
        {getTournamentStatusForId(props.tournament.statusId)}
        {props.tournament.statusId === 'upcoming' && (
          <>
            Start Date: {startDate.toLocaleDateString()} (
            <CountdownTimer deadline={startDate} timeOutMessage="Registration period is over!" />)
          </>
        )}
      </Typography>
      {props.tournament.description && props.tournament.description.length > 0 && (
        <Typography variant="subtitle1" align="center">
          {props.tournament.description}
        </Typography>
      )}
    </Container>
  )
}
