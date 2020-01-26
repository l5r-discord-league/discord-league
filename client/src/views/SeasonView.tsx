import React from "react";
import { Season } from '../../../src/season/season'
import axios from 'axios'
import { SeasonRow, SeasonStatus } from '../components/SeasonRow'

export interface SeasonViewState {
    seasons: Season[]
}

export class SeasonView extends React.Component<{}, SeasonViewState> {
    constructor(props: any) {
        super(props)
        this.state = {seasons: []}
    }

    componentDidMount() {
        axios.get("http://localhost:8080/seasons").then(resp => {
            this.setState({seasons: resp.data})
        })
    }

    getOngoingSeasons(): Season[] {
        return this.state.seasons.filter(season => season.status !== SeasonStatus.Upcoming && season.status !== SeasonStatus.Finished)
    }

    getFinishedSeasons(): Season[] {
        return this.state.seasons.filter(season => season.status === SeasonStatus.Finished)
    }

    getUpcomingSeasons(): Season[] {
        return this.state.seasons.filter(season => season.status === SeasonStatus.Upcoming)
    }

    render() {
        return <div>
                <header className="App-header">
                    Upcoming Seasons
                    {this.getUpcomingSeasons().map(season =>
                        <SeasonRow season={season}/>
                    )}
                    <br/>
                    Ongoing Seasons
                    {this.getOngoingSeasons().map(season =>
                        <SeasonRow season={season}/>
                    )}
                    <br/>
                    Finished Seasons
                    {this.getFinishedSeasons().map(season =>
                        <SeasonRow season={season}/>
                    )}
                </header>
            </div>

    }
}