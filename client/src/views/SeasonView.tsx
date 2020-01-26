import React from "react";
import { Season } from '../../../src/season/season'
import axios from 'axios'
import { SeasonRow } from '../components/SeasonRow'

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

    render() {
        return <div>
                    {this.state.seasons.map(season =>
                        <SeasonRow season={season}/>
                    )}
                </div>

    }
}