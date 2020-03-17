import React, { useReducer, Dispatch, SetStateAction } from 'react'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'
import {
  Container,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core'
import { isAdmin } from '../hooks/useUsers'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Tournament } from '../hooks/useTournaments'
import { MessageSnackBar } from './MessageSnackBar'
import { useHistory } from 'react-router-dom'
import { request } from '../utils/request'
import { EditTournamentModal } from '../modals/EditTournamentModal'

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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any) {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, dialogOpen: true }
    case 'CLOSE_DIALOG':
      return { ...state, dialogOpen: false }
    case 'OPEN_EDIT_MODAL':
      return { ...state, editModalOpen: true }
    case 'CLOSE_EDIT_MODAL':
      return { ...state, editModalOpen: false }
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        editModalOpen: false,
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
    default:
      throw new Error()
  }
}

export function TournamentAdminPanel(props: {
  tournament: Tournament
  onTournamentUpdate: Dispatch<SetStateAction<Tournament | undefined>>
}) {
  const classes = useStyles()
  const user = useCurrentUser()
  const initialState: State = {
    dialogOpen: false,
    snackBarMessage: '',
    snackBarOpen: false,
    requestError: false,
    editModalOpen: false,
  }

  const history = useHistory()
  const [state, dispatch] = useReducer(reducer, initialState)

  function dialogClose() {
    dispatch({ type: 'CLOSE_DIALOG' })
  }

  function deleteTournament() {
    request
      .delete('/api/tournament/' + props.tournament.id)
      .then(() => {
        history.push('/tournaments')
      })
      .catch(error =>
        dispatch({
          type: 'REQUEST_ERROR',
          payload: 'The tournament could not be deleted: ' + error.data,
        })
      )
  }

  function updateTournamentInfo(name: string, startDate: Date, description?: string) {
    request
      .put('/api/tournament/' + props.tournament.id, {
        id: props.tournament.id,
        name: name,
        startDate: startDate,
        description: description,
        statusId: props.tournament.statusId,
        typeId: props.tournament.typeId,
      })
      .then(resp => {
        props.onTournamentUpdate(resp.data)
        dispatch({ type: 'UPDATE_SUCCESS', payload: 'The tournament was updated successfully!' })
      })
      .catch(error =>
        dispatch({
          type: 'REQUEST_ERROR',
          payload: 'The tournament could not be updated: ' + error.data,
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
            startIcon={<DeleteForeverIcon />}
            aria-label="delete"
            variant="contained"
            className={classes.button}
            onClick={() => dispatch({ type: 'OPEN_DIALOG' })}
          >
            Delete
          </Button>
        </div>
      )}
      <Dialog
        open={state.dialogOpen}
        onClose={dialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Do you really want to delete this tournament?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color="error">
            This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dialogClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={deleteTournament} color="primary" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
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
