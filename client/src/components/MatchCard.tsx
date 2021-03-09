import { ShortMatchData, ParticipantWithUserData } from '@dl/api'
import {
  Card,
  Typography,
  Grid,
  Box,
  makeStyles,
  Theme,
  createStyles,
  Button,
  Fab,
  Divider,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { Dispatch, useCallback, useContext, useReducer } from 'react'

import { UserContext } from '../App'
import { api } from '../api'
import { isAdmin } from '../hooks/useUsers'
import { ReportMatchModal, MatchReportState } from '../modals/ReportMatchModal'
import { getVictoryConditionForId } from '../utils/victoryConditionsUtils'
import { ClanMon } from './ClanMon'
import { DeletionDialog } from './DeletionDialog'
import { MessageSnackBar } from './MessageSnackBar'
import UserAvatar from './UserAvatar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    matchContainer: {
      padding: theme.spacing(1),
      position: 'relative',
      width: '100%',
    },
    centeredContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      position: 'absolute',
      right: theme.spacing(1),
      bottom: theme.spacing(1),
    },
    fab: {
      marginTop: theme.spacing(1),
    },
    card: {
      marginTop: '4px',
    },
  })
)

interface State {
  modalOpen: boolean
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
  dialogOpen: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, modalOpen: true }
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false }
    case 'OPEN_DIALOG':
      return { ...state, dialogOpen: true }
    case 'CLOSE_DIALOG':
      return { ...state, dialogOpen: false }
    case 'SUCCESS':
      return {
        ...state,
        modalOpen: false,
        snackBarMessage: action.payload,
        requestError: false,
        snackBarOpen: true,
      }
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

const useReportMatchResult = (matchId: number, dispatch: Dispatch<any>, onSuccess?: () => void) =>
  useCallback(
    (matchReport: MatchReportState) => {
      api.Match.updateReport({ matchId, body: { ...matchReport, id: matchId } })
        .then(() => {
          dispatch({ type: 'SUCCESS', payload: 'The match result has been reported successfully!' })
          onSuccess && onSuccess()
        })
        .catch(() => {
          dispatch({
            type: 'REQUEST_ERROR',
            payload: 'The match result could not be reported',
          })
        })
    },
    [dispatch, onSuccess, matchId]
  )
const useDeleteMatchReport = (matchId: number, dispatch: Dispatch<any>, onSuccess?: () => void) =>
  useCallback(() => {
    api.Match.deleteReport({ matchId })
      .then(() => {
        dispatch({ type: 'SUCCESS', payload: 'The match result has been deleted successfully!' })
        onSuccess && onSuccess()
      })
      .catch(() =>
        dispatch({
          type: 'REQUEST_ERROR',
          payload: 'The match result could not be deleted',
        })
      )
  }, [dispatch, onSuccess, matchId])

export function MatchCard(props: {
  match: ShortMatchData
  participantA: ParticipantWithUserData
  participantB: ParticipantWithUserData
  onReportSuccess?: () => void
  onReportDelete?: () => void
}) {
  const initialState: State = {
    snackBarMessage: '',
    snackBarOpen: false,
    requestError: false,
    modalOpen: false,
    dialogOpen: false,
  }
  const classes = useStyles()
  const user = useContext(UserContext)
  const [state, dispatch] = useReducer(reducer, initialState)
  const reportMatchResult = useReportMatchResult(props.match.id, dispatch, props.onReportSuccess)
  const deleteMatchReport = useDeleteMatchReport(props.match.id, dispatch, props.onReportDelete)

  function getWinner(winnerId: number | undefined): ParticipantWithUserData | undefined {
    if (!winnerId) {
      return undefined
    }
    if (winnerId === props.participantA.id) {
      return props.participantA
    }
    if (winnerId === props.participantB.id) {
      return props.participantB
    }
    return undefined
  }

  const winner = getWinner(props.match.winnerId)

  return (
    <Card className={classes.card}>
      <Box className={classes.matchContainer}>
        <Grid container>
          <Grid item xs={12} md={3}>
            <Grid container>
              <Grid item xs={1}>
                <ClanMon clanId={props.match.deckAClanId} small />
              </Grid>
              <Grid item xs={2}>
                <UserAvatar
                  userId={props.participantA.userId}
                  userAvatar={props.participantA.discordAvatar}
                  userName={props.participantA.discordTag}
                  small
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} md={3}>
            <Grid container justify="center" alignContent="center">
              <Typography color="primary">vs</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}>
            <Grid container>
              <Grid item xs={1}>
                <ClanMon clanId={props.match.deckBClanId} small />
              </Grid>
              <Grid item xs={2}>
                <UserAvatar
                  userId={props.participantB.userId}
                  userAvatar={props.participantB.discordAvatar}
                  userName={props.participantB.discordTag}
                  small
                />
              </Grid>
            </Grid>
          </Grid>
          {!props.match.winnerId &&
            user &&
            (user.discordId === props.participantA.userId ||
              user.discordId === props.participantB.userId) && (
              <Button
                color="primary"
                variant="contained"
                className={classes.button}
                onClick={() => dispatch({ type: 'OPEN_MODAL' })}
              >
                Report Match
              </Button>
            )}
        </Grid>
        {winner && (
          <Grid container>
            <br />
            <Divider />
            <Grid item xs={12}>
              <Typography>
                Winner: {winner.discordTag}, Victory Condition:{' '}
                {getVictoryConditionForId(props.match.victoryConditionId)}
              </Typography>
            </Grid>
          </Grid>
        )}
        {winner && isAdmin(user) && (
          <div className={classes.button}>
            <Fab
              color="primary"
              aria-label="edit"
              size="small"
              className={classes.fab}
              onClick={() => dispatch({ type: 'OPEN_MODAL' })}
            >
              <EditIcon />
            </Fab>
            <Fab
              color="primary"
              aria-label="delete"
              size="small"
              className={classes.fab}
              onClick={() => dispatch({ type: 'OPEN_DIALOG' })}
            >
              <DeleteIcon />
            </Fab>
          </div>
        )}
      </Box>
      <ReportMatchModal
        modalOpen={state.modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSubmit={reportMatchResult}
        match={props.match}
        participantA={props.participantA}
        participantB={props.participantB}
      />
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
      <DeletionDialog
        entity="match report"
        dialogOpen={state.dialogOpen}
        onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}
        handleDeleteAction={() => deleteMatchReport()}
      />
    </Card>
  )
}
