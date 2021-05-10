import { Tournament, RankedParticipant, UserRowData } from '@dl/api'
import { Typography, Button, makeStyles, Theme, createStyles, Box } from '@material-ui/core'
import { useCallback, useReducer, useContext, useMemo } from 'react'

import { UserContext } from '../App'
import { api } from '../api'
import { isAdmin } from '../hooks/useUsers'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { clans } from '../utils/clanUtils'
import { timezones } from '../utils/timezoneUtils'
import { MessageSnackBar } from './MessageSnackBar'
import { ParticipationTable } from './ParticipationTable'
import { PlayersPieChart } from './PlayersPieChart'

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
    pieChartContainer: {
      marginTop: theme.spacing(3),
    },
  })
)

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

const useCreateParticipant = (
  tournamentId: number,
  dispatch: any,
  setParticipants: any,
  participants: any[]
) =>
  useCallback(
    (userId: string, clanId: number, timezoneId: number, timezonePreferenceId: string) => {
      api.Tournament.createParticipant({
        tournamentId,
        body: { userId, clanId, timezoneId, timezonePreferenceId },
      })
        .then((resp) => {
          dispatch({
            type: 'SUCCESS',
            payload: "You've successfully registered for the tournament.",
          })
          setParticipants([...participants, resp.data])
        })
        .catch((error) => {
          dispatch({
            type: 'FAILURE',
            payload: 'An error occurred during tournament registration: ' + error.data,
          })
        })
    },
    [dispatch, participants, setParticipants, tournamentId]
  )

export function TournamentParticipationPanel({
  tournament,
  participants,
  onUpdate,
  users,
}: {
  tournament: Tournament
  participants: RankedParticipant[]
  users: UserRowData[]
  onUpdate: () => void
}) {
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, initialState)
  const user = useContext(UserContext)
  const createParticipant = useCreateParticipant(tournament.id, dispatch, onUpdate, participants)
  const currentUserParticipation = useMemo(
    () => participants.find((participant) => participant.userId === user?.discordId),
    [participants, user]
  )
  const pieChartData = useMemo(
    () =>
      clans.map((clan) => ({
        color: clan.color,
        title: clan.name,
        value: participants.filter((participant) => participant.clanId === clan.clanId).length,
      })),
    [participants]
  )
  const timezoneData = useMemo(
    () =>
      timezones.map((timezone) => ({
        title: timezone.timezone,
        value: participants.filter((participant) => participant.timezoneId === timezone.id).length,
      })),
    [participants]
  )

  return (
    <div className={classes.root}>
      <Typography variant="h6" align="center">
        Players
      </Typography>
      <Box>
        {currentUserParticipation && (
          <ParticipationTable
            data={[currentUserParticipation]}
            title="My Participation"
            tournamentId={tournament.id}
            onUpdate={onUpdate}
            users={users}
            isEditable={tournament.statusId === 'upcoming'}
          />
        )}

        <ParticipationTable
          data={participants}
          title="Participants"
          tournamentId={tournament.id}
          onUpdate={onUpdate}
          users={users}
          isEditable={user && isAdmin(user)}
        />
      </Box>

      {tournament.statusId === 'upcoming' && user && (!currentUserParticipation || isAdmin(user)) && (
        <Box className={classes.container}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => dispatch({ type: 'OPEN_MODAL' })}
          >
            Register
          </Button>
        </Box>
      )}

      <div className={classes.pieChartContainer}>
        <PlayersPieChart participants={participants} />
      </div>

      <EditParticipationModal
        modalOpen={state.modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSubmit={createParticipant}
        users={users}
        title={'Register for ' + tournament.name}
      />

      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
    </div>
  )
}
