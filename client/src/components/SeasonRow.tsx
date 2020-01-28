import React from 'react'
import { Season } from '../../../src/season/season'
import { Card } from 'react-bootstrap'

export interface SeasonRowProps {
  season: Season
}

export enum SeasonStatus {
  Upcoming,
  GroupStage,
  DeckSubmission,
  BracketStage,
  Finished,
}

export class SeasonRow extends React.Component<SeasonRowProps, {}> {
  constructor(props: any) {
    super(props)
    console.log(SeasonStatus[this.props.season.status])
  }
  render() {
    return (
      <Card>
        Name: {this.props.season.name} (Status: {SeasonStatus[this.props.season.status]})
      </Card>
    )
  }
}
