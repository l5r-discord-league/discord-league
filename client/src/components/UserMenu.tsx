import React, { useContext } from 'react'
import { Button, IconButton, Menu, MenuItem } from '@material-ui/core'
import { UserContext } from '../App'
import { useHistory } from 'react-router-dom'
import UserAvatar from './UserAvatar'
import { unsetToken } from '../utils/request'

function registerUser() {
  window.location.href = '/api/auth'
}

export default function UserMenu() {
  const user = useContext(UserContext)
  const history = useHistory()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function navigate(to: string) {
    handleClose()
    history.push(to)
  }

  function logout() {
    unsetToken()
    window.location.reload()
  }

  return user ? (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <UserAvatar user={user} />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => navigate('/user/' + user.discordId)}>My profile</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  ) : (
    <Button color="secondary" variant="contained" onClick={() => registerUser()}>
      Login via Discord
    </Button>
  )
}
