import { Match } from '../hooks/useTournamentPod'
import React, { useCallback, useContext, useReducer } from 'react'
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
import { ClanMon } from './ClanMon'
import UserAvatar from './UserAvatar'
import { useHistory } from 'react-router-dom'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { UserContext } from '../App'
import { isAdmin } from '../hooks/useUsers'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import AddIcon from '@material-ui/icons/Add'
import { MessageSnackBar } from './MessageSnackBar'
import { request } from '../utils/request'

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

type ParticipantX = {
  id: number
  userId: string
  clanId: number
  discordAvatar: string
  discordDiscriminator: string
  discordName: string
  dropped: boolean
  wins: number
  losses: number
  position: number
}
type PodX = {
  id: number
  name: string
  matches: Match[]
  participants: ParticipantX[]
}

export function PodTable(props: {
  pod: PodX
  onDrop?: (participant: ParticipantX) => void
  podLink?: boolean
  detailed?: boolean
}) {
  const classes = useStyles()
  const history = useHistory()
  const currentUser = useContext(UserContext)

  const initialState: State = {
    snackBarOpen: false,
    requestError: false,
    snackBarMessage: '',
    modalOpen: false,
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  const navigateToPod = useCallback(() => {
    history.push(`/pod/${props.pod.id}`)
  }, [history, props.pod.id])

  function createParticipantInPod(
    userId: string,
    clanId: number,
    timezoneId: number,
    timezonePreferenceId: string
  ) {
    request
      .post('/api/pod/' + props.pod.id + '/participant', {
        userId: userId,
        clanId: clanId,
        timezoneId: timezoneId,
        timezonePreferenceId: timezonePreferenceId,
      })
      .then(() => {
        dispatch({
          type: 'SUCCESS',
          payload:
            "You've successfully registered the player for this pod. Please reload the page.",
        })
      })
      .catch((error) => {
        dispatch({
          type: 'FAILURE',
          payload: 'An error occurred during tournament registration: ' + error.data,
        })
      })
  }

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

  function getRowStyle(index: number, podSize: number): string {
    if (index < 2) {
      return classes.goldCupRow
    } else if (index >= 2 && index < podSize - 2) {
      return classes.silverCupRow
    } else {
      return classes.unqualifiedRow
    }
  }

  function findFirstWinForParticipant(participantId: number, matches: Match[]): Date | undefined {
    const firstWin = matches.find((match) => match.winnerId === participantId)
    return firstWin ? new Date(firstWin.updatedAt) : undefined
  }

  function getFirstWinDate(participantId: number): string {
    const winDate = participantToFirstWin[participantId]
    return winDate !== undefined ? winDate.toLocaleString() : '---'
  }

  function getParticipantName(participant: {
    id: number
    dropped: boolean
    discordName: string
    discordDiscriminator: string
  }): string {
    const nameString = participant.id === winnerOfFirstMatch ? '💥 ' : ''
    return `${nameString} ${participant.dropped ? '💧 ' : ''}${participant.discordName}#${
      participant.discordDiscriminator
    } `
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
                  <Button onClick={navigateToPod}>
                    <ExitToAppIcon /> Details
                  </Button>
                )}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.sticky} width="5%">
              Clan
            </TableCell>
            <TableCell className={classes.sticky} width="60%">
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
          {sortedParticipants.map((participant, index) => (
            <TableRow
              key={participant.id}
              className={getRowStyle(index, sortedParticipants.length)}
            >
              <TableCell className={classes.sticky}>
                <ClanMon clanId={participant.clanId} small />
              </TableCell>
              <TableCell
                className={classes.name}
                onClick={() => history.push('/user/' + participant.userId)}
              >
                <UserAvatar
                  userId={participant.userId}
                  userAvatar={participant.discordAvatar}
                  userName={getParticipantName(participant)}
                  small
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
