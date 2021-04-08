import { useCallback, useContext, useReducer } from 'react'
import { User, User$patchById } from '@dl/api'
import {
  Box,
  Button,
  Container,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'

import { useUser } from '../hooks/useUser'
import { useParams } from 'react-router-dom'
import { UserContext } from '../App'
import UserAvatar from '../components/UserAvatar'
import { MessageSnackBar } from '../components/MessageSnackBar'
import { isAdmin } from '../hooks/useUsers'
import { ClanMon } from '../components/ClanMon/ClanMon'
import { ClanSelect } from '../components/ClanSelect'
import { Loading } from '../components/Loading'
import { RequestError } from '../components/RequestError'
import { EmptyState } from '../components/EmptyState'
import { UserRole } from '../components/UserRole'
import { api } from '../api'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  isEditModeEnabled: boolean
  isUpdating: boolean
  snackBarMessage?: string
  snackBarError?: boolean
  canToggle: boolean
  newJigokuName?: string
  newPreferredClanId?: number
}

function init(): State {
  return {
    isUpdating: false,
    isEditModeEnabled: false,
    canToggle: true,
  }
}

type Action =
  | { type: 'snackbar.dismiss' }
  | { type: 'permissions.change.start' }
  | { type: 'permissions.change.success' }
  | { type: 'permissions.change.error'; payload: string }
  | { type: 'editMode.start' }
  | { type: 'editMode.jigokuName.edit'; payload: string }
  | { type: 'editMode.preferredClan.edit'; payload?: number }
  | { type: 'editMode.sendRequest' }
  | { type: 'editMode.success' }
  | { type: 'editMode.error'; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'permissions.change.start':
      return { ...state, canToggle: false }
    case 'permissions.change.success':
      return {
        ...state,
        canToggle: true,
        snackBarMessage: 'The profile has been updated successfully!',
        snackBarError: false,
      }
    case 'permissions.change.error':
      return { ...state, canToggle: true, snackBarMessage: action.payload, snackBarError: true }
    case 'editMode.start':
      return { ...state, isEditModeEnabled: true }
    case 'editMode.jigokuName.edit':
      return { ...state, newJigokuName: action.payload }
    case 'editMode.preferredClan.edit':
      return { ...state, newPreferredClanId: action.payload }
    case 'editMode.sendRequest':
      return { ...state, isUpdating: true }
    case 'editMode.success':
      return {
        ...state,
        isUpdating: false,
        snackBarMessage: 'The profile has been updated successfully!',
        snackBarError: false,
        isEditModeEnabled: false,
      }
    case 'editMode.error':
      return { ...state, isUpdating: false, snackBarMessage: action.payload, snackBarError: true }
    case 'snackbar.dismiss':
      return { ...state, snackBarMessage: undefined }
  }
}

function useToggleRole(dispatch: React.Dispatch<Action>, onSuccess: () => void, data?: User) {
  return useCallback(() => {
    if (!data) {
      return
    }

    dispatch({ type: 'permissions.change.start' })
    api.User.patchById({
      userId: data.discordId,
      body: { permissions: data.permissions === 1 ? 0 : 1 },
    })
      .then(() => {
        dispatch({ type: 'permissions.change.success' })
        onSuccess()
      })
      .catch((res) => {
        dispatch({ type: 'permissions.change.error', payload: res.data() })
      })
  }, [dispatch, onSuccess, data])
}

function useUpdateUserProfile(
  dispatch: React.Dispatch<Action>,
  onSuccess: () => void,
  state: State,
  discordId?: string
) {
  return useCallback(() => {
    if (!discordId) {
      return
    }

    const updates: User$patchById['request']['body'] = {}
    if (typeof state.newJigokuName === 'string') {
      updates.jigokuName = state.newJigokuName
    }
    if (typeof state.newPreferredClanId === 'number') {
      updates.preferredClanId = state.newPreferredClanId
    }

    api.User.patchById({ userId: discordId, body: updates })
      .then(() => {
        dispatch({ type: 'editMode.success' })
        onSuccess()
      })
      .catch((res) => {
        dispatch({ type: 'editMode.error', payload: res.data() })
      })
  }, [dispatch, onSuccess, discordId, state])
}

export function UserProfile() {
  const classes = useStyles()
  const { id } = useParams<{ id: string }>()
  const currentUser = useContext(UserContext)
  const isCurrentUser = id === currentUser?.discordId
  const [data, refetchData] = useUser(id)

  const [state, dispatch] = useReducer(reducer, undefined, init)
  const toggleRole = useToggleRole(dispatch, refetchData, data.data)
  const updateUserProfile = useUpdateUserProfile(dispatch, refetchData, state, data.data?.discordId)

  if (data.loading) {
    return <Loading />
  }
  if (typeof data.error === 'string') {
    return <RequestError requestError={data.error} />
  }
  if (!data.data) {
    return <EmptyState />
  }

  return (
    <Container>
      <Paper>
        <Container className={classes.headline}>
          <Typography variant="h5" align="center">
            Profile of {data.data.tag}
          </Typography>
        </Container>
        <br />
        <Grid container spacing={3} alignItems="stretch" alignContent="center">
          <Grid item xs={5} className={classes.formContainer}>
            <Box display="flex" justifyContent="center">
              <UserAvatar displayAvatarURL={data.data.displayAvatarURL} large />
            </Box>
            <br />
            <Box display="flex" justifyContent="center">
              <UserRole admin={isAdmin(data.data)} />
            </Box>
            {!isCurrentUser && isAdmin(currentUser) && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={toggleRole}
                disabled={!state.canToggle}
              >
                {isAdmin(data.data) ? 'Revoke Admin' : 'Grant Admin'}
              </Button>
            )}
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={6} className={classes.formContainer}>
            <Container>
              <Typography>
                Jigoku Name:{' '}
                {state.isEditModeEnabled ? (
                  <TextField
                    id="jigokuName"
                    value={state.newJigokuName ?? data.data.jigokuName}
                    onChange={({ currentTarget: { value } }) =>
                      dispatch({ type: 'editMode.jigokuName.edit', payload: value })
                    }
                  />
                ) : (
                  data.data.jigokuName
                )}
              </Typography>
            </Container>
            <br />
            <Container>
              <Typography>
                Preferred Clan:{' '}
                {state.isEditModeEnabled ? (
                  <ClanSelect
                    preferredClanId={state.newPreferredClanId}
                    neutralAllowed
                    label="Preferred Clan"
                    onChange={(clanId) =>
                      dispatch({ type: 'editMode.preferredClan.edit', payload: clanId })
                    }
                  />
                ) : (
                  <ClanMon clanId={data.data.preferredClanId} />
                )}
              </Typography>
            </Container>
            {state.isEditModeEnabled && (
              <Button
                color="secondary"
                variant="contained"
                className={classes.button}
                onClick={updateUserProfile}
                disabled={state.isUpdating}
              >
                Save Changes
              </Button>
            )}
            {!state.isEditModeEnabled && isCurrentUser && (
              <Button
                color="secondary"
                aria-label="edit"
                variant="contained"
                className={classes.button}
                onClick={() => dispatch({ type: 'editMode.start' })}
              >
                Edit Profile
              </Button>
            )}
          </Grid>
        </Grid>
        <br />
      </Paper>
      {typeof state.snackBarMessage === 'string' && state.snackBarMessage.length > 0 && (
        <MessageSnackBar
          open
          onClose={() => dispatch({ type: 'snackbar.dismiss' })}
          error={state.snackBarError}
          message={state.snackBarMessage}
        />
      )}
    </Container>
  )
}
