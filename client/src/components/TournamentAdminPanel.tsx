import { Tournament, Tournament$startGroupStage } from '@dl/api'
import { Typography, Button, Divider, makeStyles, Theme, createStyles } from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { useReducer, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { UserContext } from '../App'
import { api } from '../api'
import { isAdmin } from '../hooks/useUsers'
import { EditTournamentModal } from '../modals/EditTournamentModal'
import { StartTournamentModal } from '../modals/StartTournamentModal'
import { DeletionDialog } from './DeletionDialog'
import { MessageSnackBar } from './MessageSnackBar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minHeight: theme.spacing(10),
    },
    paddedContainer: {
      padding: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(1),
    },
  })
)

interface State {
  dialogOpen: boolean
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
  editModalOpen: boolean
  startTournamentModalOpen: boolean
}

const initialState = (): State => ({
  dialogOpen: false,
  snackBarMessage: '',
  snackBarOpen: false,
  requestError: false,
  editModalOpen: false,
  startTournamentModalOpen: false,
})
type Action =
  | { type: 'OPEN_DIALOG' }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'OPEN_EDIT_MODAL' }
  | { type: 'CLOSE_EDIT_MODAL' }
  | { type: 'OPEN_START_MODAL' }
  | { type: 'CLOSE_START_MODAL' }
  | { type: 'UPDATE_SUCCESS'; payload: string }
  | { type: 'REQUEST_ERROR'; payload: string }
  | { type: 'CLOSE_SNACKBAR' }
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, dialogOpen: true }
    case 'CLOSE_DIALOG':
      return { ...state, dialogOpen: false }
    case 'OPEN_EDIT_MODAL':
      return { ...state, editModalOpen: true }
    case 'CLOSE_EDIT_MODAL':
      return { ...state, editModalOpen: false }
    case 'OPEN_START_MODAL':
      return { ...state, startTournamentModalOpen: true }
    case 'CLOSE_START_MODAL':
      return { ...state, startTournamentModalOpen: false }
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        editModalOpen: false,
        startTournamentModalOpen: false,
        snackBarMessage: action.payload,
        requestError: false,
        snackBarOpen: true,
      }
    case 'REQUEST_ERROR':
      return {
        ...state,
        snackBarOpen: true,
        snackBarMessage: action.payload,
        requestError: true,
      }
    case 'CLOSE_SNACKBAR':
      return {
        ...state,
        snackBarOpen: false,
      }
  }
}

export function TournamentAdminPanel(props: {
  tournament: Tournament
  onTournamentUpdate: () => void
}) {
  const classes = useStyles()
  const user = useContext(UserContext)
  const history = useHistory()
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  function deleteTournament() {
    api.Tournament.deleteById({ tournamentId: props.tournament.id })
      .then(() => history.push('/tournaments'))
      .catch(() =>
        dispatch({
          type: 'REQUEST_ERROR',
          payload: 'The tournament could not be deleted',
        })
      )
  }

  function updateTournament(tournament: Tournament) {
    api.Tournament.updateById({ tournamentId: props.tournament.id, body: tournament })
      .then(() => {
        props.onTournamentUpdate()
        dispatch({ type: 'UPDATE_SUCCESS', payload: 'The tournament was updated successfully!' })
      })
      .catch(() =>
        dispatch({
          type: 'REQUEST_ERROR',
          payload: 'The tournament could not be updated',
        })
      )
  }

  function updateTournamentInfo(name: string, startDate: Date, description?: string) {
    updateTournament({
      id: props.tournament.id,
      name: name,
      startDate: startDate.toJSON(),
      description: description,
      statusId: props.tournament.statusId,
      typeId: props.tournament.typeId,
    })
  }

  function startTournament(deadline: Date) {
    const body: Tournament$startGroupStage['request']['body'] = {
      deadline: new Date(
        Date.UTC(deadline.getFullYear(), deadline.getMonth(), deadline.getDate())
      ).toJSON(),
    }
    api.Tournament.startGroupStage({ tournamentId: props.tournament.id, body })
      .then(() => {
        props.onTournamentUpdate()
        dispatch({ type: 'UPDATE_SUCCESS', payload: 'The tournament was updated successfully!' })
      })
      .catch(() =>
        dispatch({
          type: 'REQUEST_ERROR',
          payload: 'Pods for this tournament could not be created',
        })
      )
  }

  return user && isAdmin(user) ? (
    <div className={classes.container}>
      <Divider />
      <Typography variant="h6" align="center">
        Admin Features
      </Typography>

      {props.tournament.statusId === 'upcoming' && (
        <div className={classes.paddedContainer}>
          <Button
            color="primary"
            startIcon={<EditIcon />}
            aria-label="edit"
            variant="contained"
            className={classes.button}
            onClick={() => dispatch({ type: 'OPEN_EDIT_MODAL' })}
          >
            Edit Tournament
          </Button>
          <Button
            color="primary"
            startIcon={<PlayArrowIcon />}
            aria-label="start"
            variant="contained"
            className={classes.button}
            onClick={() => dispatch({ type: 'OPEN_START_MODAL' })}
          >
            Start Tournament
          </Button>
          <Button
            color="primary"
            startIcon={<DeleteForeverIcon />}
            aria-label="delete"
            variant="contained"
            className={classes.button}
            onClick={() => dispatch({ type: 'OPEN_DIALOG' })}
          >
            Delete Tournament
          </Button>
        </div>
      )}
      <DeletionDialog
        entity="tournament"
        dialogOpen={state.dialogOpen}
        onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}
        handleDeleteAction={deleteTournament}
      />
      <StartTournamentModal
        modalOpen={state.startTournamentModalOpen}
        onClose={() => dispatch({ type: 'CLOSE_START_MODAL' })}
        onSubmit={startTournament}
      />
      <EditTournamentModal
        modalOpen={state.editModalOpen}
        onClose={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}
        onSubmit={updateTournamentInfo}
        title="Edit Tournament"
        initialState={{
          name: props.tournament.name,
          startDate: new Date(props.tournament.startDate),
          description: props.tournament.description,
        }}
      />
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
    </div>
  ) : (
    <div />
  )
}
