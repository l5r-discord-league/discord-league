import React, { useReducer } from 'react'
import {
  makeStyles,
  Theme,
  createStyles,
  Container,
  Fab,
  Modal,
  Grid,
  TextField,
  Button,
  ButtonGroup,
} from '@material-ui/core'

import { TournamentList } from '../components/TournamentList'
import { useTournaments, Tournament } from '../hooks/useTournaments'
import { MessageSnackBar } from '../components/MessageSnackBar'
import AddIcon from '@material-ui/icons/Add'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { isAdmin } from '../hooks/useUsers'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { request } from '../utils/request'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      width: 600,
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
      width: 400,
    },
  })
)

interface State {
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
  modalOpen: boolean
  newName: string
  newStartDate: Date | null
  newDescription: string
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
    case 'CANCEL':
      return {
        ...state,
        modalOpen: false,
        newName: '',
        newDescription: '',
        newStartDate: new Date(),
      }
    case 'NEW_NAME':
      return { ...state, newName: action.payload }
    case 'NEW_DESCRIPTION':
      return { ...state, newDescription: action.payload }
    case 'NEW_DATE': {
      return { ...state, newStartDate: action.payload }
    }
    case 'SUCCESS':
      return {
        snackBarOpen: true,
        snackBarMessage: action.payload,
        requestError: false,
        modalOpen: false,
        newName: '',
        newDescription: '',
        newStartDate: new Date(),
      }
    case 'FAILURE':
      return {
        ...state,
        snackBarOpen: true,
        snackBarMessage: action.payload,
        requestError: true,
      }
    default:
      throw new Error()
  }
}

function groupTournaments(tournaments: Tournament[]) {
  return tournaments.reduce(
    (grouped, tournament) => {
      switch (tournament.statusId) {
        case 'finished':
          grouped.finished.push(tournament)
          break
        case 'upcoming':
          grouped.upcoming.push(tournament)
          break
        default:
          grouped.ongoing.push(tournament)
      }
      return grouped
    },
    { ongoing: [] as Tournament[], finished: [] as Tournament[], upcoming: [] as Tournament[] }
  )
}

export function TournamentView() {
  const initialState: State = {
    snackBarOpen: false,
    requestError: false,
    snackBarMessage: '',
    modalOpen: false,
    newName: '',
    newStartDate: new Date(),
    newDescription: '',
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const [tournaments, setTournaments] = useTournaments()
  const user = useCurrentUser()
  const classes = useStyles()
  const { upcoming, ongoing, finished } = groupTournaments(tournaments)

  function createTournament() {
    request
      .post('/api/tournament', {
        name: state.newName,
        startDate: new Date(
          Date.UTC(
            state.newStartDate.getFullYear(),
            state.newStartDate.getMonth(),
            state.newStartDate.getDate()
          )
        ),
        description: state.newDescription,
        type: 'monthly',
        status: 'upcoming',
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(resp => {
        dispatch({ type: 'SUCCESS', payload: 'The tournament was created successfully!' })
        setTournaments([...tournaments, resp.data])
      })
      .catch(() => {
        dispatch({ type: 'FAILURE', payload: 'The tournament could not be created!' })
      })
  }

  return (
    <div className={classes.root}>
      <Container>
        <h4>Tournaments</h4>
        <TournamentList label="Upcoming" tournaments={upcoming} />
        <TournamentList label="Ongoing" tournaments={ongoing} />
        <TournamentList label="Finished" tournaments={finished} />
      </Container>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Modal
          aria-labelledby="create-tournament-modal-title"
          aria-describedby="create-tournament-modal-description"
          open={state.modalOpen}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
          className={classes.modal}
        >
          <div className={classes.paper}>
            <h2 id="create-tournament-modal-title">Create new Tournament</h2>
            <br />
            <Grid container direction="column" alignItems="stretch">
              <Grid item>
                <TextField
                  required
                  label="Tournament Name"
                  id="tournament-name"
                  variant="outlined"
                  className={classes.inputField}
                  value={state.newName}
                  onChange={event =>
                    dispatch({ type: 'NEW_NAME', payload: event.currentTarget.value })
                  }
                />
              </Grid>
              <Grid item>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="tournament-start-date"
                  label="Tournament Start Date"
                  value={state.newStartDate}
                  onChange={(date: Date | null) => dispatch({ type: 'NEW_DATE', payload: date })}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Tournament Description"
                  id="tournament-name"
                  variant="outlined"
                  value={state.newDescription}
                  rows={3}
                  multiline
                  className={classes.inputField}
                  onChange={event =>
                    dispatch({ type: 'NEW_DESCRIPTION', payload: event.currentTarget.value })
                  }
                />
              </Grid>
            </Grid>
            <br />
            <br />
            <ButtonGroup className={classes.buttonGroup}>
              <Button
                color="inherit"
                variant="contained"
                onClick={() => dispatch({ type: 'CANCEL' })}
              >
                Cancel
              </Button>
              <Button color="primary" variant="contained" onClick={() => createTournament()}>
                Create Tournament
              </Button>
            </ButtonGroup>
          </div>
        </Modal>
      </MuiPickersUtilsProvider>
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
      {user && isAdmin(user) && (
        <Fab
          color="secondary"
          aria-label="edit"
          className={classes.fab}
          onClick={() => dispatch({ type: 'OPEN_MODAL' })}
        >
          <AddIcon />
        </Fab>
      )}
    </div>
  )
}
