import React, { useCallback, useReducer, useContext } from 'react'
import {
  Typography,
  Divider,
  Button,
  makeStyles,
  Theme,
  createStyles,
  Box,
  Grid,
} from '@material-ui/core'
import ReactMinimalPieChart, { PieChartData } from 'react-minimal-pie-chart'

import { UserContext } from '../App'
import { Participant } from '../api'
import { Tournament } from '../hooks/useTournaments'
import { isAdmin } from '../hooks/useUsers'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { clans } from '../utils/clanUtils'
import { request } from '../utils/request'
import { timezones } from '../utils/timezoneUtils'
import { MessageSnackBar } from './MessageSnackBar'
import { ParticipationTable } from './ParticipationTable'

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
      paddingTop: theme.spacing(3),
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
      return request
        .post(`/api/tournament/${tournamentId}/participant`, {
          userId: userId,
          clanId: clanId,
          timezoneId: timezoneId,
          timezonePreferenceId: timezonePreferenceId,
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
  setParticipants,
}: {
  tournament: Tournament
  participants: Participant[]
  setParticipants: (participant: any) => void
}) {
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, initialState)
  const user = useContext(UserContext)
  const createParticipant = useCreateParticipant(
    tournament.id,
    dispatch,
    setParticipants,
    participants
  )

  const currentUserParticipation = participants.find(
    (participant) => participant.userId === user?.discordId
  )

  function calculatePieChartData(): PieChartData[] {
    return clans.map((clan) => {
      return {
        color: clan.color,
        title: clan.name,
        value: participants.filter((participant) => participant.clanId === clan.index).length,
      }
    })
  }

  function calculateTimezoneData(): { title: string; value: number }[] {
    return timezones.map((timezone) => {
      return {
        title: timezone.timezone,
        value: participants.filter((participant) => participant.timezoneId === timezone.id).length,
      }
    })
  }

  return (
    <div className={classes.root}>
      <Divider />
      <Typography variant="h6" align="center">
        Participants
      </Typography>
      <Box>
        {currentUserParticipation && (
          <ParticipationTable
            data={[currentUserParticipation]}
            title="My Participation"
            tournamentId={tournament.id}
            updateParticipants={setParticipants}
            isEditable={tournament.statusId === 'upcoming'}
          />
        )}
        <ParticipationTable
          data={participants}
          title="Participants"
          tournamentId={tournament.id}
          updateParticipants={setParticipants}
          isEditable={user && isAdmin(user)}
        />
      </Box>
      {user && !currentUserParticipation && tournament.statusId === 'upcoming' && (
        <Box className={classes.container}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => dispatch({ type: 'OPEN_MODAL' })}
          >
            Register
          </Button>{' '}
        </Box>
      )}
      <Grid container className={classes.pieChartContainer}>
        <Grid item xs={12} md={6}>
          <ReactMinimalPieChart
            data={calculatePieChartData().sort((a, b) => b.value - a.value)}
            paddingAngle={0}
            radius={42}
            style={{
              height: '300px',
            }}
            viewBoxSize={[300, 300]}
            label
            labelPosition={112}
            labelStyle={{
              fontFamily: 'sans-serif',
              fontSize: '24px',
            }}
            startAngle={270}
            lengthAngle={360}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Total number of participants: {participants.length}</Typography>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Typography>By Clan:</Typography>
              {calculatePieChartData().map((data) => (
                <Typography key={data.color}>
                  {data.title}: <b>{data.value}</b>
                </Typography>
              ))}
            </Grid>
            {user && isAdmin(user) && (
              <Grid item xs={12} sm={6}>
                <Typography>By Timezone:</Typography>
                {calculateTimezoneData().map((data) => (
                  <Typography key={data.title}>
                    {data.title}: <b>{data.value}</b>
                  </Typography>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <EditParticipationModal
        modalOpen={state.modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSubmit={createParticipant}
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
