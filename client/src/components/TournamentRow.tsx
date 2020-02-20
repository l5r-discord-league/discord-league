import React, { useState } from 'react'
import { Tournament } from '../../../src/season/tournament'
import { Card, Container } from '@material-ui/core'

export interface TournamentRowProps {
  tournament: Tournament
}

export enum TournamentStatus {
  Upcoming,
  GroupStage,
  DeckSubmission,
  BracketStage,
  Finished,
}

export function TournamentRow(props: TournamentRowProps): JSX.Element {
  const [tournament] = useState(props.tournament)

  return (
    <Container>
      <Card>
        Name: {tournament.name} (Status: {TournamentStatus[tournament.status]})
      </Card>
    </Container>
  )
}
