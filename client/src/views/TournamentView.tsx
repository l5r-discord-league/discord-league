import React, { useReducer } from 'react'
import { makeStyles, Theme, createStyles, Container, Fab } from '@material-ui/core'

import { TournamentList } from '../components/TournamentList'
import { useTournaments, Tournament } from '../hooks/useTournaments'
import { MessageSnackBar } from '../components/MessageSnackBar'
import AddIcon from '@material-ui/icons/Add'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { isAdmin } from '../hooks/useUsers'
import { request } from '../utils/request'
import { CreateTournamentModal } from '../modals/CreateTournamentModal'

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
        snackBarOpen: true,
        snackBarMessage: action.payload,
        requestError: false,
        modalOpen: false,
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
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const [tournaments, setTournaments] = useTournaments()
  const user = useCurrentUser()
  const classes = useStyles()
  const { upcoming, ongoing, finished } = groupTournaments(tournaments)

  function createTournament(name: string, startDate: Date, description: string) {
    request
      .post('/api/tournament', {
        name: name,
        startDate: new Date(
          Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
        ),
        description: description,
        type: 'monthly',
        status: 'upcoming',
      })
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
      <CreateTournamentModal
        modalOpen={state.modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSubmit={createTournament}
      />
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
