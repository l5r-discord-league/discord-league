import React, { useContext, useState } from 'react'
import EditIcon from '@material-ui/icons/Edit'
import {
  Container,
  Typography,
  Fab,
  Button,
  makeStyles,
  Theme,
  createStyles,
  Grid,
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  Snackbar,
} from '@material-ui/core'
import { useUser } from '../hooks/useUser'
import { useParams } from 'react-router-dom'
import { UserContext } from '../App'
import UserAvatar from '../components/UserAvatar'
import { TournamentList } from '../components/TournamentList'
import { request } from '../utils/request'

const clans: { index: number; name: string }[] = [
  { index: 1, name: 'Crab' },
  { index: 2, name: 'Crane' },
  { index: 3, name: 'Dragon' },
  { index: 4, name: 'Lion' },
  { index: 5, name: 'Phoenix' },
  { index: 6, name: 'Scorpion' },
  { index: 7, name: 'Unicorn' },
]

function getClanForId(id?: number): string | undefined {
  let value
  if (id) {
    value = clans.find(clan => clan.index === id)?.name
  }
  return value || ''
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    formContainer: {
      position: 'relative',
    },
    button: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(4),
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
  })
)

export function UserProfile() {
  const classes = useStyles()
  const currentUser = useContext(UserContext)
  const { id } = useParams()
  const isCurrentUser = id === currentUser?.discordId
  const [isEdit, setIsEdit] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [failureOpen, setFailureOpen] = useState(false)

  const [user, setUser, error, isLoading] = useUser(id)

  function updateUser() {
    request
      .put('/api/user/' + id, user)
      .then(() => {
        setSuccessOpen(true)
        setIsEdit(false)
      })
      .catch(() => setFailureOpen(true))
  }

  function handleClose() {
    setSuccessOpen(false)
    setFailureOpen(false)
  }

  if (isLoading) {
    return <h4>Loading...</h4>
  }
  if (error) {
    return <div>Error while retrieving data: {error}</div>
  }
  return user ? (
    <Container>
      <Paper>
        <Container>
          <Typography variant="h5" align="center">
            Profile of {user.discordName}#{user.discordDiscriminator}
          </Typography>
        </Container>
        <br />
        <Grid container spacing={3} alignItems="stretch" alignContent="center">
          <Grid item xs={3}>
            <Box display="flex" justifyContent="center">
              <UserAvatar user={user} large />
            </Box>
          </Grid>
          <Grid item xs={9} className={classes.formContainer}>
            <Container>
              <Typography>
                Jigoku Name:{' '}
                {isEdit ? (
                  <TextField
                    id="jigokuName"
                    value={user.jigokuName}
                    onChange={event => setUser({ ...user, jigokuName: event.currentTarget.value })}
                  />
                ) : (
                  user.jigokuName
                )}
              </Typography>
            </Container>
            <br />
            <Container>
              <Typography>
                Preferred Clan:{' '}
                {isEdit ? (
                  <Select
                    id="preferredClan"
                    value={user.preferredClanId}
                    onChange={event =>
                      setUser({ ...user, preferredClanId: event.target.value as number })
                    }
                  >
                    <MenuItem value={undefined}>
                      <em>None</em>
                    </MenuItem>
                    {clans.map(clan => (
                      <MenuItem value={clan.index} key={clan.index}>
                        {clan.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  getClanForId(user.preferredClanId)
                )}
              </Typography>
            </Container>
            {isEdit && (
              <Button
                color="secondary"
                variant="contained"
                className={classes.button}
                onClick={() => updateUser()}
              >
                Save Changes
              </Button>
            )}
          </Grid>
        </Grid>
        {!isEdit && (
          <Fab
            color="secondary"
            aria-label="edit"
            disabled={!isCurrentUser}
            className={classes.fab}
            onClick={() => setIsEdit(true)}
          >
            <EditIcon />
          </Fab>
        )}
        <br />
        <TournamentList label={user.discordName + "'s"} tournaments={[]} />
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Profile was updated successfully!"
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={failureOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Profile could not be updated!"
      />
    </Container>
  ) : (
    <div>No data found.</div>
  )
}
