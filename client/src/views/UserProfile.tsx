import React, { useContext, useEffect, useReducer } from 'react'
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
import { ClanMon } from '../components/ClanMon'
import { ClanSelect } from '../components/ClanSelect'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
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
    headline: {
      padding: theme.spacing(1),
    },
  })
)

interface State {
  isEdit: boolean
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
  canToggle: boolean
  jigokuName: string
  preferredClan: number | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, jigokuName: action.payload }
    case 'SET_CLAN':
      return { ...state, preferredClan: action.payload }
    case 'TOGGLE':
      return { ...state, canToggle: false }
    case 'EDIT':
      return { ...state, isEdit: true }
    case 'CLOSE_SNACKBAR':
      return { ...state, snackBarOpen: false }
    case 'SUCCESS':
      return {
        ...state,
        requestError: false,
        isEdit: false,
        canToggle: true,
        snackBarMessage: action.payload,
        snackBarOpen: true,
      }
    case 'FAILURE':
      return {
        ...state,
        snackBarMessage: action.payload,
        requestError: true,
        snackBarOpen: true,
        canToggle: true,
      }
    default:
      throw new Error()
  }
}

export function UserProfile() {
  const classes = useStyles()
  const currentUser = useContext(UserContext)
  const { id } = useParams()
  const isCurrentUser = id === currentUser?.discordId
  const [user, setUser, error, isLoading] = useUser(id)

  const initialState: State = {
    isEdit: false,
    snackBarOpen: false,
    requestError: false,
    snackBarMessage: '',
    canToggle: true,
    jigokuName: '',
    preferredClan: null,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (user) {
      dispatch({ type: 'SET_NAME', payload: user.jigokuName })
      dispatch({ type: 'SET_CLAN', payload: user.preferredClanId })
    }
  }, [user])

  function sendPutRequest(successMessage: string, errorMessage: string, updatedUser: User) {
    request
      .put('/api/user/' + id, updatedUser)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((resp: any) => {
        dispatch({ type: 'SUCCESS', payload: successMessage })
        setUser(resp.data)
      })
      .catch(() => {
        dispatch({ type: 'FAILURE', payload: errorMessage })
      })
  }

  function updateUserProfile() {
    if (user) {
      const updatedUser = {
        ...user,
        jigokuName: state.jigokuName,
        preferredClanId: state.preferredClan || null,
      }
      sendPutRequest(
        'The profile has been updated successfully!',
        'The profile could not be updated!',
        updatedUser
      )
    }
  }

  function togglePermissions() {
    dispatch({ type: 'TOGGLE' })
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
        <Container className={classes.headline}>
          <Typography variant="h5" align="center">
            Profile of {user.discordName}#{user.discordDiscriminator}
          </Typography>
        </Container>
        <br />
        <Grid container spacing={3} alignItems="stretch" alignContent="center">
          <Grid item xs={5} direction="column" className={classes.formContainer}>
            <Box display="flex" justifyContent="center">
              <UserAvatar userId={user.discordId} userAvatar={user.discordAvatar} large />
            </Box>
            <br />
            <Box display="flex" justifyContent="center">
              <UserChip user={user} />
            </Box>
            {!isCurrentUser && currentUser && isAdmin(currentUser) && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => togglePermissions()}
                disabled={!state.canToggle}
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
                {state.isEdit ? (
                  <TextField
                    id="jigokuName"
                    value={state.jigokuName}
                    onChange={event =>
                      dispatch({ type: 'SET_NAME', payload: event.currentTarget.value })
                    }
                  />
                ) : (
                  state.jigokuName
                )}
              </Typography>
            </Container>
            <br />
            <Container>
              <Typography>
                Preferred Clan:{' '}
                {state.isEdit ? (
                  <ClanSelect
                    preferredClanId={state.preferredClan}
                    neutralAllowed
                    label="Preferred Clan"
                    onChange={event =>
                      dispatch({
                        type: 'SET_CLAN',
                        payload: event.target.value as number | undefined,
                      })
                    }
                  />
                ) : (
                  <ClanMon clanId={state.preferredClan} />
                )}
              </Typography>
            </Container>
            {state.isEdit && (
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
        {!state.isEdit && isCurrentUser && (
          <Fab
            color="secondary"
            aria-label="edit"
            className={classes.fab}
            onClick={() => dispatch({ type: 'EDIT' })}
          >
            <EditIcon />
          </Fab>
        )}
        <br />
        <TournamentList label={user.discordName + "'s"} tournaments={[]} />
      </Paper>
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
    </Container>
  ) : (
    <div>No data found.</div>
  )
}
