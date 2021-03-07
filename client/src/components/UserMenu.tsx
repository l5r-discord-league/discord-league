import { Button, IconButton, Menu, MenuItem } from '@material-ui/core'
import { memo, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { UserContext } from '../App'
import { unsetToken } from '../utils/auth'
import UserAvatar from './UserAvatar'

function registerUser() {
  window.location.href = '/api/auth'
}

function logout() {
  unsetToken()
  window.location.reload()
}

export const UserMenu = memo(() => {
  const user = useContext(UserContext)
  const history = useHistory()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  function navigate(to: string) {
    handleClose()
    history.push(to)
  }

  if (!user) {
    return (
      <Button color="secondary" variant="contained" onClick={registerUser}>
        Login via Discord
      </Button>
    )
  }

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={({ currentTarget }) => {
          setAnchorEl(currentTarget)
        }}
        color="inherit"
      >
        <UserAvatar displayAvatarURL={user.displayAvatarURL} />
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
        open={anchorEl != null}
        onClose={handleClose}
      >
        <MenuItem onClick={() => navigate(`/user/${user.discordId}`)}>My profile</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  )
})
