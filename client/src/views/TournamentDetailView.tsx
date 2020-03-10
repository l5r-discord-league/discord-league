import React, { useReducer } from 'react'
import { useTournament } from '../hooks/useTournament'
import { useParams, useHistory } from 'react-router-dom'
import { request } from '../utils/request'
import {
  Container,
  Paper,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { isAdmin } from '../hooks/useUsers'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { MessageSnackBar } from '../components/MessageSnackBar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteButton: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    container: {
      position: 'relative',
    },
  })
)

interface State {
  dialogOpen: boolean
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any) {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, dialogOpen: true }
    case 'CLOSE_DIALOG':
      return { ...state, dialogOpen: false }
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

export function TournamentDetailView() {
  const initialState: State = {
    dialogOpen: false,
    snackBarMessage: '',
    snackBarOpen: false,
    requestError: false,
  }

  const history = useHistory()
  const classes = useStyles()
  const { id } = useParams()
  const [tournament, setTournament, error, isLoading] = useTournament(id)
  const user = useCurrentUser()
  const [state, dispatch] = useReducer(reducer, initialState)

  function dialogClose() {
    dispatch({ type: 'CLOSE_DIALOG' })
  }

  function deleteTournament() {
    request
      .delete('/api/tournament/' + id)
      .then(() => {
        history.push('/tournaments')
      })
      .catch(() =>
        dispatch({ type: 'REQUEST_ERROR', payload: 'The tournament could not be deleted!' })
      )
  }

  if (isLoading) {
    return <h5>Loading...</h5>
  }
  return tournament ? (
    <div>
      <Container>
        <Paper>
          <Container>
            <Typography variant="h5" align="center">
              Details of Tournament "{tournament.name}"
            </Typography>
          </Container>
          <Container className={classes.container}>
            <br />
            <br />
            <br />
            <br />
            <br />
            {tournament.statusId === 'upcoming' && user && isAdmin(user) && (
              <Button
                color="primary"
                startIcon={<DeleteForeverIcon />}
                aria-label="delete"
                variant="contained"
                className={classes.deleteButton}
                onClick={() => dispatch({ type: 'OPEN_DIALOG' })}
              >
                Delete
              </Button>
            )}
          </Container>
        </Paper>
      </Container>
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
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
    </div>
  ) : (
    <div>No data found.</div>
  )
}
