import React, { useReducer, useContext } from 'react'
import {
  Container,
  Typography,
  Divider,
  Button,
  makeStyles,
  Theme,
  createStyles,
  Box,
  Grid,
} from '@material-ui/core'
import { Tournament } from '../hooks/useTournaments'
import { useTournamentParticipants } from '../hooks/useTournamentParticipants'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { MessageSnackBar } from './MessageSnackBar'
import { request } from '../utils/request'
import { ParticipationTable } from './ParticipationTable'
import { UserContext } from '../App'
import ReactMinimalPieChart, { PieChartData } from 'react-minimal-pie-chart'
import { clans } from '../utils/clanUtils'
import { timezones } from '../utils/timezoneUtils'
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
  const [participants, setParticipants, isLoading, error] = useTournamentParticipants(
    props.tournament.id
  )
  const [state, dispatch] = useReducer(reducer, initialState)
  const user = useContext(UserContext)

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
      .then(resp => {
        dispatch({ type: 'SUCCESS', payload: "You've successfully registered for the tournament." })
        setParticipants([...participants, resp.data])
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

  function calculatePieChartData(): PieChartData[] {
    return clans.map(clan => {
      return {
        color: clan.color,
        title: clan.name,
        value: participants.filter(participant => participant.clanId === clan.index).length,
      }
    })
  }

  function calculateTimezoneData(): { title: string; value: number }[] {
    return timezones.map(timezone => {
      return {
        title: timezone.timezone,
        value: participants.filter(participant => participant.timezoneId === timezone.id).length,
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
            tournamentId={props.tournament.id}
            updateParticipants={setParticipants}
            isEditable={props.tournament.statusId === 'upcoming'}
          />
        )}
        <ParticipationTable
          data={participants}
          title="Participants"
          tournamentId={props.tournament.id}
          updateParticipants={setParticipants}
          isEditable={user && isAdmin(user)}
        />
      </Box>
      {user && !currentUserParticipation && props.tournament.statusId === 'upcoming' && (
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
              {calculatePieChartData().map(data => (
                <Typography key={data.color}>
                  {data.title}: <b>{data.value}</b>
                </Typography>
              ))}
            </Grid>
            {user && isAdmin(user) && (
              <Grid item xs={12} sm={6}>
                <Typography>By Timezone:</Typography>
                {calculateTimezoneData().map(data => (
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
        title={'Register for ' + props.tournament.name}
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
