import React, { useReducer } from 'react'
import {
  Container,
  Typography,
  Divider,
  Button,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core'
import { Tournament } from '../hooks/useTournaments'
import { useTournamentParticipants } from '../hooks/useTournamentParticipants'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { MessageSnackBar } from './MessageSnackBar'
import { request } from '../utils/request'
import { ParticipationTable } from './ParticipationTable'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { isAdmin } from '../hooks/useUsers'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    container: {
      position: 'relative',
      minHeight: theme.spacing(8),
    },
    root: {
      paddingBottom: theme.spacing(5),
    },
  })
)

interface State {
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
  modalOpen: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any) {
  switch (action.type) {
    case 'CLOSE_SNACKBAR':
      return { ...state, snackBarOpen: false }
    case 'OPEN_MODAL':
      return { ...state, modalOpen: true }
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false }
    case 'SUCCESS':
      return {
        ...state,
        requestError: false,
        snackBarMessage: action.payload,
        snackBarOpen: true,
        modalOpen: false,
      }
    case 'FAILURE':
      return {
        ...state,
        snackBarMessage: action.payload,
        requestError: true,
        snackBarOpen: true,
      }
    default:
      throw new Error(action.type)
  }
}

export function TournamentParticipationPanel(props: { tournament: Tournament }) {
  const initialState: State = {
    snackBarOpen: false,
    requestError: false,
    snackBarMessage: '',
    modalOpen: false,
  }

  const classes = useStyles()
  const [participants, , isLoading, error] = useTournamentParticipants(props.tournament.id)
  const [state, dispatch] = useReducer(reducer, initialState)
  const user = useCurrentUser()

  function createParticipant(
    userId: string,
    clanId: number,
    timezoneId: number,
    timezonePreferenceId: string
  ) {
    request
      .post('/api/tournament/' + props.tournament.id + '/participant', {
        userId: userId,
        clanId: clanId,
        timezoneId: timezoneId,
        timezonePreferenceId: timezonePreferenceId,
      })
      .then(() => {
        dispatch({ type: 'SUCCESS', payload: "You've successfully registered for the tournament" })
        window.location.reload()
      })
      .catch(error => {
        dispatch({
          type: 'FAILURE',
          payload: 'An error occurred during tournament registration: ' + error.data,
        })
      })
  }
  if (isLoading) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      </Container>
    )
  }
  if (error) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          Error while retrieving data: {error}
        </Typography>
      </Container>
    )
  }
  const currentUserParticipation = participants.find(
    participant => participant.userId === user?.discordId
  )
  return (
    <Container className={classes.root}>
      <Divider />
      <Typography variant="h6" align="center">
        Participants
      </Typography>
      <Container>
        {currentUserParticipation && (
          <ParticipationTable
            data={[currentUserParticipation]}
            title="My Participation"
            tournamentId={props.tournament.id}
            singleParticipantView
          />
        )}
        <ParticipationTable
          data={participants}
          title="Participants"
          tournamentId={props.tournament.id}
        />
      </Container>
      {(!currentUserParticipation || (user && isAdmin(user))) && (
        <Container className={classes.container}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => dispatch({ type: 'OPEN_MODAL' })}
          >
            Register
          </Button>{' '}
        </Container>
      )}
      <EditParticipationModal
        modalOpen={state.modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSubmit={createParticipant}
        title={'Register for ' + props.tournament.name}
      />
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
    </Container>
  )
}
