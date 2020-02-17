import React, { ReactNode } from 'react'
import { Tournament } from '../../../src/season/tournament'
import axios from 'axios'
import { TournamentRow, TournamentStatus } from '../components/TournamentRow'
import { Accordion, Card } from 'react-bootstrap'

export interface TournamentViewState {
  tournaments: Tournament[]
}

export class TournamentView extends React.Component<{}, TournamentViewState> {
  constructor(props: any) {
    super(props)
    this.state = { tournaments: [] }
  }

  componentDidMount(): void {
    axios.get('http://localhost:8080/tournament').then(resp => {
      this.setState({ tournaments: resp.data })
    })
  }

  getOngoingTournaments(): Tournament[] {
    return this.state.tournaments.filter(
      tournament =>
        tournament.status !== TournamentStatus.Upcoming &&
        tournament.status !== TournamentStatus.Finished
    )
  }

  getFinishedTournaments(): Tournament[] {
    return this.state.tournaments.filter(
      tournament => tournament.status === TournamentStatus.Finished
    )
  }

  getUpcomingTournaments(): Tournament[] {
    return this.state.tournaments.filter(
      tournament => tournament.status === TournamentStatus.Upcoming
    )
  }

  render(): ReactNode {
    return (
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="upcoming">
            Upcoming Tournaments
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="upcoming">
            <Card.Body>
              {this.getUpcomingTournaments().map(tournament => (
                <TournamentRow tournament={tournament} key={tournament.id} />
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="ongoing">
            Ongoing Tournaments
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="ongoing">
            <Card.Body>
              {this.getOngoingTournaments().map(tournament => (
                <TournamentRow tournament={tournament} key={tournament.id} />
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="finished">
            Finished Tournaments
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="finished">
            <Card.Body>
              {this.getFinishedTournaments().map(tournament => (
                <TournamentRow tournament={tournament} key={tournament.id} />
              ))}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    )
  }
}
