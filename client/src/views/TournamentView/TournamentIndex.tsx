import { memo, useCallback, useReducer, useState } from 'react'
import {
  Container,
  createStyles,
  Fab,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Theme,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import { api, Tournament$findAll } from '../../api'
import { MessageSnackBar } from '../../components/MessageSnackBar'
import { TournamentList } from '../../components/TournamentList'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { EditTournamentModal } from '../../modals/EditTournamentModal'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
    },
    tabs: {
      marginBottom: theme.spacing(2),
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
)

type Action =
  | { type: 'CLOSE_SNACKBAR' | 'OPEN_MODAL' | 'CLOSE_MODAL' }
  | { type: 'SUCCESS' | 'FAILURE'; payload: string }
interface State {
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
  modalOpen: boolean
}
const initialState: State = {
  snackBarOpen: false,
  requestError: false,
  snackBarMessage: '',
  modalOpen: false,
}

function reducer(state: State, action: Action) {
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
  }
}

const useCreateTournament = (dispatch: (action: any) => void, onSuccess: () => void) =>
  useCallback(
    (name: string, startDate: Date, description?: string) => {
      api.Tournament.create({
        body: {
          name,
          startDate,
          description,
          type: 'pod6',
          status: 'upcoming',
        },
      })
        .then(() => {
          dispatch({ type: 'SUCCESS', payload: 'The tournament was created successfully!' })
          onSuccess()
        })
        .catch((res) =>
          dispatch({
            type: 'FAILURE',
            payload: `The tournament could not be created: ${res.error()}`,
          })
        )
    },
    [dispatch, onSuccess]
  )

export const TournamentIndex = memo(
  (props: { tournaments: Tournament$findAll; onCreateTournamentSuccess: () => void }) => {
    const classes = useStyles()
    const isAdmin = useIsAdmin()
    const [state, dispatch] = useReducer(reducer, initialState)
    const createTournament = useCreateTournament(dispatch, props.onCreateTournamentSuccess)
    const [activeTab, setActiveTab] = useState<'current' | 'archive'>('current')

    return (
      <div className={classes.root}>
        <Container>
          <Paper className={classes.tabs}>
            <Tabs value={activeTab} onChange={(_, newTab) => setActiveTab(newTab)}>
              <Tab label="Current" value="current" />
              <Tab label="Archive" value="archive" />
            </Tabs>
          </Paper>

          {activeTab === 'current' && (
            <>
              {props.tournaments.upcoming.length > 0 && (
                <TournamentList label="Upcoming" tournaments={props.tournaments.upcoming} />
              )}
              {props.tournaments.ongoing.length > 0 && (
                <TournamentList label="Ongoing" tournaments={props.tournaments.ongoing} />
              )}
            </>
          )}
          {activeTab === 'archive' && props.tournaments.past.length > 0 && (
            <TournamentList label="Finished" tournaments={props.tournaments.past} />
          )}
        </Container>
        <EditTournamentModal
          modalOpen={state.modalOpen}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
          onSubmit={createTournament}
          title="Create new Tournament"
        />
        <MessageSnackBar
          open={state.snackBarOpen}
          onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
          error={state.requestError}
          message={state.snackBarMessage}
        />
        {isAdmin && (
          <Fab
            color="primary"
            aria-label="edit"
            variant="extended"
            className={classes.fab}
            onClick={() => dispatch({ type: 'OPEN_MODAL' })}
          >
            <AddIcon />
            New Tournament
          </Fab>
        )}
      </div>
    )
  }
)
