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
  InputLabel,
} from '@material-ui/core'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ClanSelect } from '../components/ClanSelect'
import { useUsers, isAdmin } from '../hooks/useUsers'
import UserAvatar from '../components/UserAvatar'
import { timezones, timezonePreferences } from '../utils/timezoneUtils'

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
  userId: string
  clanId: number
  timezoneId: number
  timezonePreferenceId: string
  participationId?: number
}

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
        userId: action.payload,
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
    userId: string,
    clanId: number,
    timezoneId: number,
    timezonePreferenceId: string,
    participationId?: number
  ) => void
  title: string
  initialState?: State
}) {
  const user = useCurrentUser()
  const users = useUsers()
  const classes = useStyles()
  const initialState: State = props.initialState || {
    userId: user?.discordId || '',
    clanId: user?.preferredClanId || 1,
    timezoneId: 1,
    timezonePreferenceId: 'similar',
    participationId: undefined,
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
        <Grid container direction="column" alignItems="stretch" spacing={4}>
          <Grid item>
            {isAdmin(user) ? (
              <div>
                <InputLabel id="userId">Participant</InputLabel>
                <Select
                  id="userId"
                  className={classes.inputField}
                  value={state.userId}
                  onChange={event =>
                    dispatch({
                      type: 'CHANGE_USER',
                      payload: event.target.value as string | undefined,
                    })
                  }
                >
                  {users.map(user => (
                    <MenuItem value={user.userId} key={user.userId}>
                      <UserAvatar
                        userId={user.user.discordId}
                        userAvatar={user.user.discordAvatar}
                        userName={user.discordName}
                        small
                      />
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ) : (
              <UserAvatar
                userId={user.discordId}
                userAvatar={user.discordAvatar}
                userName={user.discordName}
                small
              />
            )}
          </Grid>
          <Grid item>
            <ClanSelect
              preferredClanId={state.clanId}
              label="Clan"
              onChange={event =>
                dispatch({
                  type: 'CHANGE_CLAN',
                  payload: event.target.value as number | undefined,
                })
              }
            />
          </Grid>
          <Grid item>
            <InputLabel id="timezoneId">Timezone</InputLabel>
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
            <InputLabel id="timezonePreferenceId">Similar Timezone?</InputLabel>
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
                state.userId || user.discordId,
                state.clanId,
                state.timezoneId,
                state.timezonePreferenceId,
                state.participationId
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