import { MatchData, ParticipantWithUserData, PodResult } from '@dl/api'
import { Dispatch, useCallback, useContext, useReducer } from 'react'
import {
  Button,
  Chip,
  createStyles,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import AddIcon from '@material-ui/icons/Add'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import { UserContext } from '../App'
import { api } from '../api'
import { isAdmin, RowUser } from '../hooks/useUsers'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { MessageSnackBar } from './MessageSnackBar'
import { UserAvatarAndClan } from './UserAvatarAndClan'

const colors = ['#4a74e8', '#44c2bc', '#30b339', '#dece23', '#de9923', '#e04946', '#d35ce0']

const useStyles = makeStyles(() =>
  createStyles({
    sticky: {
      position: 'sticky',
    },
    name: {
      overflowWrap: 'anywhere',
    },
    goldCupRow: {
      background: '#ffe494',
    },
    silverCupRow: {
      background: '#e6e4e1',
    },
    unqualifiedRow: {
      background: 'white',
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

const useCreateParticipantInPod = (podId: number, dispatch: Dispatch<any>) =>
  useCallback(
    (userId: string, clanId: number, timezoneId: number, timezonePreferenceId: string) => {
      api.Pod.createParticipant({
        podId,
        body: { userId, clanId, timezoneId, timezonePreferenceId },
      })
        .then(() =>
          dispatch({
            type: 'SUCCESS',
            payload:
              "You've successfully registered the player for this pod. Please reload the page.",
          })
        )
        .catch((response) =>
          dispatch({
            type: 'FAILURE',
            payload: 'An error occurred during tournament registration: ' + response.error(),
          })
        )
    },
    [podId, dispatch]
  )

export function PodTable(props: {
  pod: PodResult
  users: RowUser[]
  onDrop?: (participant: ParticipantWithUserData) => void
  podLink?: boolean
  detailed?: boolean
}) {
  const classes = useStyles()
  const history = useHistory()
  const currentUser = useContext(UserContext)
  const [state, dispatch] = useReducer(reducer, initialState)
  const createParticipantInPod = useCreateParticipantInPod(props.pod.id, dispatch)

  const sortedParticipants = props.pod.participants.sort((a, b) => a.position - b.position)
  const sortedMatches = props.pod.matches
    .filter((match) => match.winnerId)
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
  const firstMatch = sortedMatches.length > 0 ? sortedMatches[0] : null
  const winnerOfFirstMatch = firstMatch?.winnerId ?? null
  const participantToFirstWin: (Date | undefined)[] = []
  sortedParticipants.forEach((participant) => {
    participantToFirstWin[participant.id] = findFirstWinForParticipant(
      participant.id,
      sortedMatches
    )
  })

  function findFirstWinForParticipant(
    participantId: number,
    matches: MatchData[]
  ): Date | undefined {
    const firstWin = matches.find((match) => match.winnerId === participantId)
    return firstWin ? new Date(firstWin.updatedAt) : undefined
  }

  function getFirstWinDate(participantId: number): string {
    const winDate = participantToFirstWin[participantId]
    return winDate !== undefined ? winDate.toLocaleString() : '---'
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table" size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: colors[props.pod.id % colors.length] }}>
            <TableCell colSpan={6}>
              <Typography variant="h6">
                {props.pod.name}
                {props.podLink && (
                  <Button onClick={() => history.push(`/pod/${props.pod.id}`)}>
                    <ExitToAppIcon /> Details
                  </Button>
                )}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.sticky} width="65%">
              User
            </TableCell>
            <TableCell className={classes.sticky} width="10%">
              Record
            </TableCell>
            {props.detailed && (
              <TableCell className={classes.sticky} width="20%">
                First Win
              </TableCell>
            )}
            {props.onDrop && <TableCell className={classes.sticky} width="5%" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedParticipants.map((participant) => (
            <TableRow
              key={participant.id}
              className={
                participant.bracket === 'goldCup'
                  ? classes.goldCupRow
                  : participant.bracket === 'silverCup'
                  ? classes.silverCupRow
                  : classes.unqualifiedRow
              }
            >
              <TableCell
                className={classes.name}
                onClick={() => history.push('/user/' + participant.userId)}
              >
                <UserAvatarAndClan
                  user={participant}
                  dropped={participant.dropped}
                  firstStrike={participant.id === winnerOfFirstMatch}
                />
              </TableCell>
              <TableCell className={classes.sticky}>
                {participant.wins} - {participant.losses}
              </TableCell>
              {props.detailed && (
                <TableCell className={classes.sticky}>{getFirstWinDate(participant.id)}</TableCell>
              )}
              {props.onDrop && (
                <TableCell className={classes.sticky} style={{ width: 60, textAlign: 'center' }}>
                  {!participant.dropped &&
                    (isAdmin(currentUser) || participant.userId === currentUser?.discordId) && (
                      <Chip
                        label="Drop"
                        icon={
                          <span role="img" aria-label="Drop">
                            💧
                          </span>
                        }
                        variant="outlined"
                        clickable
                        onClick={() => {
                          if (typeof props.onDrop === 'function') {
                            props.onDrop(participant)
                          }
                        }}
                      />
                    )}
                </TableCell>
              )}
            </TableRow>
          ))}
          {sortedParticipants.length < 7 && isAdmin(currentUser) && (
            <TableRow>
              <TableCell colSpan={6} className={classes.name} align="center">
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => dispatch({ type: 'OPEN_MODAL' })}
                >
                  <AddIcon />
                  Add Player
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <EditParticipationModal
        modalOpen={state.modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSubmit={createParticipantInPod}
        users={props.users}
        title={'Register for Pod ' + props.pod.name}
      />
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
    </TableContainer>
  )
}
