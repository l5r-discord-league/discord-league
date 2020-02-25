import React from 'react'
import { Card, Container, Typography } from '@material-ui/core'
import { TournamentRecord } from '../views/TournamentView'
import { CountdownTimer } from '../utils/CountdownTimer'

export enum TournamentStatus {
  Upcoming,
  GroupStage,
  DeckSubmission,
  BracketStage,
  Finished,
}

export function TournamentRow(props: { tournament: TournamentRecord }): JSX.Element {
  const startDate: Date = new Date(props.tournament.start_date)

  return (
    <Container>
      <Card>
        <Typography>
          Name: {props.tournament.name} (Status: {props.tournament.status_id})
        </Typography>
        {props.tournament.description ? (
          <Typography>{props.tournament.description}</Typography>
        ) : (
          ''
        )}
        <Typography>
          Start Date: {startDate.toLocaleString()} (in <CountdownTimer deadline={startDate} />)
        </Typography>
      </Card>
    </Container>
  )
}
