import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import React, { useContext, useReducer } from 'react'
import { Match } from '../hooks/useTournamentPods'
import {
  Card,
  Typography,
  Grid,
  Box,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from '@material-ui/core'
import UserAvatar from './UserAvatar'
import { CountdownTimer } from './CountdownTimer'
import { ClanMon } from './ClanMon'
import { UserContext } from '../App'
import { MessageSnackBar } from './MessageSnackBar'
import { ReportMatchModal, MatchReportState } from '../modals/ReportMatchModal'
import { request } from '../utils/request'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    matchContainer: {
      padding: theme.spacing(1),
    },
    centeredContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  })
)

interface State {
  modalOpen: boolean
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { ...state, modalOpen: true }
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false }
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

export function MatchCard(props: {
  match: Match
  participantA: ParticipantWithUserData
  participantB: ParticipantWithUserData
  updateMatch: (match: Match) => void
}) {
  const initialState: State = {
    snackBarMessage: '',
    snackBarOpen: false,
    requestError: false,
    modalOpen: false,
  }
  const classes = useStyles()
  const deadline = new Date(props.match.deadline)
  const user = useContext(UserContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  function reportMatchResult(matchReport: MatchReportState) {
    request
      .put('/api/match/' + props.match.id, { ...matchReport, id: props.match.id })
      .then(resp => {
        dispatch({ type: 'SUCCESS', payload: 'The match result has been reported successfully!' })
        props.updateMatch(resp.data)
      })
      .catch(error =>
        dispatch({
          type: 'REQUEST_ERROR',
          payload: 'The match result could not be reported: ' + error,
        })
      )
  }

  return (
    <Card>
      <Box className={classes.matchContainer}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <ClanMon clanId={props.match.deckAClanId} />
          </Grid>
          <Grid item xs={6}>
            <UserAvatar
              userId={props.participantA.userId}
              userAvatar={props.participantA.discordAvatar}
              userName={
                props.participantA.discordName + '#' + props.participantA.discordDiscriminator
              }
            />
          </Grid>
          <Grid item xs={5} className={classes.centeredContainer} justify="space-between">
            {props.match.winnerId === props.participantA.id && (
              <Typography color="error">WINNER!</Typography>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={3}>
            <Typography color="primary" align="center">
              VERSUS
            </Typography>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={6}>
            {!props.match.winnerId && (
              <div>
                <Typography align="right">
                  Deadline <CountdownTimer deadline={deadline} timeOutMessage="is over!" />
                </Typography>
              </div>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={1}>
            <ClanMon clanId={props.match.deckBClanId} />
          </Grid>
          <Grid item xs={6}>
            <UserAvatar
              userId={props.participantB.userId}
              userAvatar={props.participantB.discordAvatar}
              userName={
                props.participantB.discordName + '#' + props.participantB.discordDiscriminator
              }
            />
          </Grid>
          <Grid item xs={5} className={classes.centeredContainer} justify="space-between">
            {props.match.winnerId === props.participantB.id ? (
              <Typography color="error">WINNER!</Typography>
            ) : (
              <div />
            )}
            {!props.match.winnerId &&
              user &&
              (user.discordId === props.participantA.userId ||
                user.discordId === props.participantB.userId) && (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => dispatch({ type: 'OPEN_MODAL' })}
                >
                  Report Match
                </Button>
              )}
          </Grid>
        </Grid>
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
    </Card>
  )
}
