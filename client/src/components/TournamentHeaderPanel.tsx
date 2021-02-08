import { Container, Typography, makeStyles, Theme, createStyles } from '@material-ui/core'
import React from 'react'
import { getTournamentStatusForId } from '../utils/statusUtils'
import { CountdownTimer } from './CountdownTimer'
import { Tournament$findById } from '../api'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headline: {
      padding: theme.spacing(1),
    },
  })
)

export function TournamentHeaderPanel({
  tournament,
}: {
  tournament: Tournament$findById['tournament']
}) {
  const classes = useStyles()
  const startDate = new Date(tournament.startDate)
  return (
    <Container className={classes.headline}>
      <Typography variant="h3" align="center">
        {tournament.name}
      </Typography>
      <Typography variant="subtitle1" align="center">
        {getTournamentStatusForId(tournament.statusId)}
        {tournament.statusId === 'upcoming' && (
          <>
            Start Date: {startDate.toLocaleDateString()} (
            <CountdownTimer
              deadline={tournament.startDate}
              timeOutMessage="Registration period is over!"
            />
            )
          </>
        )}
      </Typography>
      {(tournament.description?.length ?? 0) > 0 && (
        <Typography variant="subtitle1" align="center">
          {tournament.description}
        </Typography>
      )}
    </Container>
  )
}
