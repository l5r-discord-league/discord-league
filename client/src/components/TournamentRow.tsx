import React from 'react'
import { Tournament } from '../../../src/season/tournament'
import { Card, Container } from '@material-ui/core'

export enum TournamentStatus {
  Upcoming,
  GroupStage,
  DeckSubmission,
  BracketStage,
  Finished,
}

export function TournamentRow(props: { tournament: Tournament }): JSX.Element {
  return (
    <Container>
      <Card>
        Name: {props.tournament.name} (Status: {TournamentStatus[props.tournament.status]})
      </Card>
    </Container>
  )
}
