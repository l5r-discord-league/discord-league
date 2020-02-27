import React from 'react'
import { Card, Container, Typography } from '@material-ui/core'
import { Tournament } from '../hooks/useTournaments'
import { CountdownTimer } from '../utils/CountdownTimer'

export enum TournamentStatus {
  Upcoming,
  GroupStage,
  DeckSubmission,
  BracketStage,
  Finished,
}

export function TournamentRow(props: { tournament: Tournament }) {
  const startDate = new Date(props.tournament.startDate)

  return (
    <Container>
      <Card>
        <Typography>
          Name: {props.tournament.name} (Status: {props.tournament.statusId})
        </Typography>
        {props.tournament.description && <Typography>{props.tournament.description}</Typography>}
        <Typography>
          Start Date: {startDate.toLocaleString()} (in <CountdownTimer deadline={startDate} />)
        </Typography>
      </Card>
    </Container>
  )
}
