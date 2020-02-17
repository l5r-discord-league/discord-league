import React, { ReactNode } from 'react'
import { Accordion, Card } from 'react-bootstrap'

export interface GameViewState {
  test: string
}

export class GameView extends React.Component<{}, GameViewState> {
  constructor(props: object) {
    super(props)
    this.state = { test: 'Test text' }
  }

  render(): ReactNode {
    return (
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="upcoming">
            Unfinished Games
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="upcoming">
            <Card.Body>Unfinished Games go here</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="ongoing">
            Finished Games
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="ongoing">
            <Card.Body>Finished Games go here</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    )
  }
}
