import React, { useReducer } from 'react'
import {
  Modal,
  Grid,
  ButtonGroup,
  Button,
  makeStyles,
  Theme,
  createStyles,
  Select,
  MenuItem,
} from '@material-ui/core'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ClanSelect } from '../utils/ClanSelect'
import { useUsers, isAdmin } from '../hooks/useUsers'
import UserAvatar from '../components/UserAvatar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    buttonGroup: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    inputField: {
      width: 350,
    },
  })
)

interface State {
  discordId: string
  clanId: number
  timezoneId: number
  timezonePreferenceId: string
}

const timezones: { id: number; timezone: string }[] = [
  { id: 1, timezone: 'UTC-12 to UTC-8' },
  { id: 2, timezone: 'UTC-7 to UTC-5' },
  { id: 3, timezone: 'UTC-4 to UTC-2' },
  { id: 4, timezone: 'UTC-1 to UTC+1' },
  { id: 5, timezone: 'UTC+2 to UTC+4' },
  { id: 6, timezone: 'UTC+5 to UTC+7' },
  { id: 7, timezone: 'UTC+8 to UTC+12' },
]

const timezonePreferences: { id: string; name: string }[] = [
  {
    id: 'similar',
    name: 'Yes',
  },
  {
    id: 'neutral',
    name: "Don't care",
  },
  {
    id: 'dissimilar',
    name: 'No',
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any): State {
  switch (action.type) {
    case 'CHANGE_CLAN':
      return {
        ...state,
        clanId: action.payload,
      }
    case 'CHANGE_USER':
      return {
        ...state,
        discordId: action.payload,
      }
    case 'CHANGE_TIMEZONE':
      return {
        ...state,
        timezoneId: action.payload,
      }
    case 'CHANGE_TIMEZONE_PREFERENCE':
      return {
        ...state,
        timezonePreferenceId: action.payload,
      }
    default:
      throw new Error()
  }
}

export function EditParticipationModal(props: {
  modalOpen: boolean
  onClose: () => void
  onSubmit: (
    discordId: string,
    clanId: number,
    timezoneId: number,
    timezonePreferenceId: string
  ) => void
  title: string
  initialState?: State
}) {
  const user = useCurrentUser()
  const users = useUsers()
  const classes = useStyles()
  const initialState: State = props.initialState || {
    discordId: user?.discordId || '',
    clanId: user?.preferredClanId || 1,
    timezoneId: 1,
    timezonePreferenceId: 'similar',
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  return user ? (
    <Modal
      aria-labelledby="edit-participation-modal-title"
      aria-describedby="edit-participation-modal-description"
      open={props.modalOpen}
      onClose={props.onClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        <h2 id="edit-participation-modal-title">{props.title}</h2>
        <br />
        <Grid container direction="column" alignItems="stretch">
          <Grid item>
            <Select
              id="participantId"
              className={classes.inputField}
              value={state.discordId}
              disabled={!isAdmin(user)}
              onChange={event =>
                dispatch({
                  type: 'CHANGE_USER',
                  payload: event.target.value as string | undefined,
                })
              }
            >
              {users.map(user => (
                <MenuItem value={user.userId} key={user.userId}>
                  <UserAvatar user={user.user} small /> {user.discordName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <ClanSelect
              preferredClanId={state.clanId}
              onChange={event =>
                dispatch({
                  type: 'CHANGE_CLAN',
                  payload: event.target.value as number | undefined,
                })
              }
            />
          </Grid>
          <Grid item>
            <Select
              id="timezoneId"
              value={state.timezoneId}
              className={classes.inputField}
              onChange={event =>
                dispatch({
                  type: 'CHANGE_TIMEZONE',
                  payload: event.target.value as number | undefined,
                })
              }
            >
              {timezones.map(timezone => (
                <MenuItem value={timezone.id} key={timezone.id}>
                  {timezone.timezone}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              id="timezonePreferenceId"
              value={state.timezonePreferenceId}
              className={classes.inputField}
              onChange={event =>
                dispatch({
                  type: 'CHANGE_TIMEZONE_PREFERENCE',
                  payload: event.target.value as string | undefined,
                })
              }
            >
              {timezonePreferences.map(preference => (
                <MenuItem value={preference.id} key={preference.id}>
                  {preference.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        <br />
        <br />
        <ButtonGroup className={classes.buttonGroup}>
          <Button
            color="inherit"
            variant="contained"
            onClick={() => {
              props.onClose()
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() =>
              props.onSubmit(
                state.discordId,
                state.clanId,
                state.timezoneId,
                state.timezonePreferenceId
              )
            }
          >
            {props.title}
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  ) : (
    <div />
  )
}
