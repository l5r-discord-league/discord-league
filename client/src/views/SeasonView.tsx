import React from "react";
import { Season } from '../../../src/season/season'
import axios from 'axios'
import { SeasonRow, SeasonStatus } from '../components/SeasonRow'
import { Accordion, Card } from "react-bootstrap";

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
        return  <Accordion>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="upcoming">
                            Upcoming Seasons
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="upcoming">
                            <Card.Body>
                                {this.getUpcomingSeasons().map(season =>
                                    <SeasonRow season={season}/>
                                )}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="ongoing">
                            Ongoing Seasons
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="ongoing">
                            <Card.Body>
                                {this.getOngoingSeasons().map(season =>
                                    <SeasonRow season={season}/>
                                )}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="finished">
                            Finished Seasons
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="finished">
                            <Card.Body>
                                {this.getFinishedSeasons().map(season =>
                                    <SeasonRow season={season}/>
                                )}
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

    }
}