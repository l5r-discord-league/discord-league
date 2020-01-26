import React from 'react'
import { Season } from '../../../src/season/season';

export interface SeasonRowProps {
    season: Season
}

export class SeasonRow extends React.Component<SeasonRowProps, {}> {
    constructor(props: any) {
        super(props)
        console.log(SeasonStatus[this.props.season.status])
    }
    render() {
        return(
            <div>
                Name: {this.props.season.name} (Status: {SeasonStatus[this.props.season.status]})
            </div>
        )
    }
}

export enum SeasonStatus {
    Upcoming,
    GroupStage,
    DeckSubmission,
    BracketStage,
    Finished
}