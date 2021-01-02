import { Pod } from '../hooks/useTournamentPods'
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
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
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

export function PodTable(props: {
  pod: Pod
  onDrop?: (participant: ParticipantWithUserData) => void
  podLink?: boolean
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

  const sortedParticipants = props.pod.records
    .slice()
    .sort((a, b) => {
      const dropSort = Number(a.dropped) - Number(b.dropped)
      const winsSort = b.wins - a.wins
      const lossesSort = b.losses - a.losses
      return dropSort !== 0 ? dropSort : winsSort !== 0 ? winsSort : lossesSort
    })
    .map((record) => {
      const participant = props.pod.participants.find(({ id }) => id === record.participantId)
      if (!participant) {
        return []
      }
      return [{ ...participant, wins: record.wins, losses: record.losses }]
    })
    .reduce((a, b) => a.concat(b))

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table" size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: colors[props.pod.id % colors.length] }}>
            <TableCell colSpan={4}>
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
            <TableCell className={classes.sticky}>Clan</TableCell>
            <TableCell>User</TableCell>
            <TableCell className={classes.sticky}>Record</TableCell>
            {props.onDrop && <TableCell className={classes.sticky} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedParticipants.map((participant) => (
            <TableRow key={participant.id}>
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
                  userName={`${participant.dropped ? '💧 ' : ''}${participant.discordName}#${
                    participant.discordDiscriminator
                  } `}
                  small
                />
              </TableCell>
              <TableCell className={classes.sticky}>
                {!participant.dropped ? `${participant.wins} - ${participant.losses}` : '0 - 7'}
              </TableCell>
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
          {sortedParticipants.length < 8 && (
            <TableRow>
              <TableCell className={classes.sticky}>
                <ClanMon clanId={0} small />
              </TableCell>
              <TableCell className={classes.name}>
                {isAdmin(currentUser) ? (
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => dispatch({ type: 'OPEN_MODAL' })}
                  >
                    <AddIcon />
                    Add Player
                  </Button>
                ) : (
                  <p>---</p>
                )}
              </TableCell>
              <TableCell className={classes.sticky}>0 - 7</TableCell>
              {props.onDrop && <TableCell className={classes.sticky} />}
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
