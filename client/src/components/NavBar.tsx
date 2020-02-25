import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'

export function NavBar() {
  const history = useHistory()

  function registerUser() {
    // TODO needs to redirect to port 8080
    history.push('/api/auth')
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="tournaments">Discord League</Navbar.Brand>
      <Nav.Link as={Link} to="tournaments">
        Tournaments
      </Nav.Link>
      <Nav.Link as={Link} to="my-games">
        My Games
      </Nav.Link>
      <Nav.Link as={Link} to="users">
        Users
      </Nav.Link>
      <Navbar.Collapse className="justify-content-end">
        <Button onClick={() => registerUser()}>Register via Discord</Button>
      </Navbar.Collapse>
    </Navbar>
  )
}
