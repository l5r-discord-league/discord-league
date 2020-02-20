import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Avatar } from '@material-ui/core'

export interface NavbarProps {
  userId: string
  userName: string
  userAvatarHash: string
}
// TODO the real avatar image is "https://cdn.discordapp.com/avatars/"userId"/"userAvatarHash".png";
export function NavBar(props: NavbarProps): JSX.Element {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="tournaments">Discord League</Navbar.Brand>
      <Nav.Link as={Link} to="tournaments">
        Tournaments
      </Nav.Link>
      <Nav.Link as={Link} to="my-games">
        My Games
      </Nav.Link>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          Signed in as: <Link to="/login">{props.userName}</Link>
        </Navbar.Text>
        <Avatar src="https://i.pinimg.com/236x/42/0f/32/420f32cbff710bb30486a88353fa7ee1.jpg" />
      </Navbar.Collapse>
    </Navbar>
  )
}
