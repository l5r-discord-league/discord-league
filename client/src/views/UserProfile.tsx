import React, { useContext, useState, useEffect } from 'react'
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
  Divider,
} from '@material-ui/core'
import { useUser } from '../hooks/useUser'
import { useParams } from 'react-router-dom'
import { UserContext } from '../App'
import UserAvatar from '../components/UserAvatar'
import { TournamentList } from '../components/TournamentList'
import { request } from '../utils/request'
import { MessageSnackBar } from '../components/MessageSnackBar'
import { isAdmin, User } from '../hooks/useUsers'
import { UserChip } from '../components/UserChip'

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
      bottom: theme.spacing(1),
      right: theme.spacing(1),
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
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [requestError, setRequestError] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [canToggle, setCanToggle] = useState(true)

  const [user, setUser, error, isLoading] = useUser(id)
  const [jigokuName, setJigokuName] = useState()
  const [preferredClan, setPreferredClan] = useState()

  useEffect(() => {
    if (user) {
      setJigokuName(user.jigokuName)
      setPreferredClan(user.preferredClanId)
    }
  }, [user])

  function sendPutRequest(successMessage: string, errorMessage: string, updatedUser: User) {
    request
      .put('/api/user/' + id, updatedUser)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((resp: any) => {
        setSnackBarMessage(successMessage)
        setRequestError(false)
        setIsEdit(false)
        setCanToggle(true)
        setUser(resp.data)
      })
      .catch(() => {
        setSnackBarMessage(errorMessage)
        setRequestError(true)
      })
      .finally(() => setSnackBarOpen(true))
  }

  function updateUserProfile() {
    if (user) {
      const updatedUser = {
        ...user,
        jigokuName: jigokuName,
        preferredClanId: preferredClan || null,
      }
      sendPutRequest(
        'The profile has been updated successfully!',
        'The profile could not be updated!',
        updatedUser
      )
    }
  }

  function togglePermissions() {
    setCanToggle(false)
    if (user) {
      const updatedUser = { ...user, permissions: Math.abs(user.permissions - 1) }
      sendPutRequest(
        'The permissions have been updated successfully!',
        'The permissions could not be updated!',
        updatedUser
      )
    }
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
          <Grid item xs={5} direction="column" className={classes.formContainer}>
            <Box display="flex" justifyContent="center">
              <UserAvatar user={user} large />
            </Box>
            <br />
            <Box display="flex" justifyContent="center">
              <UserChip user={user} />
            </Box>
            {!isCurrentUser && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => togglePermissions()}
                disabled={!canToggle}
              >
                {isAdmin(user) ? 'Revoke Admin' : 'Grant Admin'}
              </Button>
            )}
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={6} className={classes.formContainer}>
            <Container>
              <Typography>
                Jigoku Name:{' '}
                {isEdit ? (
                  <TextField
                    id="jigokuName"
                    value={jigokuName}
                    onChange={event => setJigokuName(event.currentTarget.value)}
                  />
                ) : (
                  jigokuName
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
                    value={preferredClan}
                    onChange={event => setPreferredClan(event.target.value as number | undefined)}
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
                  getClanForId(preferredClan)
                )}
              </Typography>
            </Container>
            {isEdit && (
              <Button
                color="secondary"
                variant="contained"
                className={classes.button}
                onClick={() => updateUserProfile()}
              >
                Save Changes
              </Button>
            )}
          </Grid>
        </Grid>
        {!isEdit && isCurrentUser && (
          <Fab
            color="secondary"
            aria-label="edit"
            className={classes.fab}
            onClick={() => setIsEdit(true)}
          >
            <EditIcon />
          </Fab>
        )}
        <br />
        <TournamentList label={user.discordName + "'s"} tournaments={[]} />
      </Paper>
      <MessageSnackBar
        open={snackBarOpen}
        onClose={() => setSnackBarOpen(false)}
        error={requestError}
        message={snackBarMessage}
      />
    </Container>
  ) : (
    <div>No data found.</div>
  )
}
