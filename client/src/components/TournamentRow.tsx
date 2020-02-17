import React, { ReactNode } from 'react'
import { Tournament } from '../../../src/season/tournament'
import { Card } from 'react-bootstrap'

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

export class TournamentRow extends React.Component<TournamentRowProps, {}> {
  constructor(props: any) {
    super(props)
    console.log(TournamentStatus[this.props.tournament.status])
  }

  render(): ReactNode {
    return (
      <Card>
        Name: {this.props.tournament.name} (Status: {TournamentStatus[this.props.tournament.status]}
        )
      </Card>
    )
  }
}
