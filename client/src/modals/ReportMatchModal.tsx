import React, { useReducer, useState } from 'react'
import {
  Modal,
  ButtonGroup,
  Button,
  makeStyles,
  Theme,
  createStyles,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { Match } from '../hooks/useTournamentPods'
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import UserAvatar from '../components/UserAvatar'
import { victoryConditions } from '../utils/victoryConditionsUtils'
import { roles } from '../utils/roleUtils'
import { clans } from '../utils/clanUtils'
import { ClanMon } from '../components/ClanMon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      width: '80%',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    buttonGroup: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    inputField: {
      width: 200,
    },
  })
)

export interface MatchReportState {
  winnerId?: number
  firstPlayerId?: number
  victoryConditionId?: number
  deckARoleId?: number
  deckASplashId?: number
  deckBRoleId?: number
  deckBSplashId?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: MatchReportState, action: any) {
  switch (action.type) {
    case 'SET_WINNER':
      return { ...state, winnerId: action.payload }
    case 'SET_FIRST':
      return { ...state, firstPlayerId: isNaN(action.payload) ? undefined : action.payload }
    case 'SET_VICTORY':
      return { ...state, victoryConditionId: action.payload }
    case 'SET_ROLE_A':
      return { ...state, deckARoleId: action.payload }
    case 'SET_SPLASH_A':
      return { ...state, deckASplashId: isNaN(action.payload) ? undefined : action.payload }
    case 'SET_ROLE_B':
      return { ...state, deckBRoleId: action.payload }
    case 'SET_SPLASH_B':
      return { ...state, deckBSplashId: isNaN(action.payload) ? undefined : action.payload }
    default:
      throw new Error()
  }
}

export function ReportMatchModal(props: {
  modalOpen: boolean
  onClose: () => void
  onSubmit: (state: MatchReportState) => void
  match: Match
  participantA: ParticipantWithUserData
  participantB: ParticipantWithUserData
}) {
  const initialState = {
    winnerId: undefined,
    firstPlayerId: undefined,
    victoryConditionId: 1,
    deckARoleId: undefined,
    deckASplashId: undefined,
    deckBRoleId: undefined,
    deckBSplashId: undefined,
  }
  const classes = useStyles()
  const [state, dispatch] = useReducer(reducer, initialState)
  const [winnerError, setWinnerError] = useState(false)
  const [victoryConditionError, setVictoryConditionError] = useState(false)

  function checkInputAndSubmit() {
    setWinnerError(false)
    setVictoryConditionError(false)
    if (!state.winnerId) {
      setWinnerError(true)
    }
    if (!state.victoryConditionId) {
      setVictoryConditionError(true)
    }
    if (state.winnerId && state.victoryConditionId) {
      props.onSubmit(state)
    }
  }

  return (
    <Modal
      aria-labelledby="report-match-modal-title"
      aria-describedby="report-match-modal-description"
      open={props.modalOpen}
      onClose={props.onClose}
      className={classes.modal}
    >
      <div className={classes.paper}>
        <h2 id="report-match-modal-title">Report Match</h2>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <Divider />
            <FormControl component="fieldset" error={winnerError}>
              <FormLabel component="legend">Winner</FormLabel>
              <RadioGroup
                aria-label="Winner"
                name="winner"
                value={state.winnerId}
                onChange={event =>
                  dispatch({
                    type: 'SET_WINNER',
                    payload: Number.parseInt((event.target as HTMLInputElement).value),
                  })
                }
              >
                <FormControlLabel
                  value={props.match.playerAId}
                  control={<Radio checked={state.winnerId === props.match.playerAId} />}
                  label={
                    <UserAvatar
                      small
                      userId={props.participantA.userId}
                      userAvatar={props.participantA.discordAvatar}
                      userName={
                        props.participantA.discordName +
                        '#' +
                        props.participantA.discordDiscriminator
                      }
                    />
                  }
                />
                <FormControlLabel
                  value={props.match.playerBId}
                  control={<Radio checked={state.winnerId === props.match.playerBId} />}
                  label={
                    <UserAvatar
                      small
                      userId={props.participantB.userId}
                      userAvatar={props.participantB.discordAvatar}
                      userName={
                        props.participantB.discordName +
                        '#' +
                        props.participantB.discordDiscriminator
                      }
                    />
                  }
                />
              </RadioGroup>
            </FormControl>
            <Divider />
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend">First Player</FormLabel>
              <RadioGroup
                aria-label="First Player"
                name="first-player"
                value={state.firstPlayerId}
                onChange={event =>
                  dispatch({
                    type: 'SET_FIRST',
                    payload: Number.parseInt((event.target as HTMLInputElement).value),
                  })
                }
              >
                <FormControlLabel
                  value={props.match.playerAId}
                  control={<Radio checked={state.firstPlayerId === props.match.playerAId} />}
                  label={
                    <UserAvatar
                      small
                      userId={props.participantA.userId}
                      userAvatar={props.participantA.discordAvatar}
                      userName={
                        props.participantA.discordName +
                        '#' +
                        props.participantA.discordDiscriminator
                      }
                    />
                  }
                />
                <FormControlLabel
                  value={props.match.playerBId}
                  control={<Radio checked={state.firstPlayerId === props.match.playerBId} />}
                  label={
                    <UserAvatar
                      small
                      userId={props.participantB.userId}
                      userAvatar={props.participantB.discordAvatar}
                      userName={
                        props.participantB.discordName +
                        '#' +
                        props.participantB.discordDiscriminator
                      }
                    />
                  }
                />
                <FormControlLabel
                  value={undefined}
                  control={<Radio checked={state.firstPlayerId === undefined} />}
                  label="Can't remember"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Divider />
            <FormControl component="fieldset" error={victoryConditionError}>
              <FormLabel component="legend">Victory Condition</FormLabel>
              <RadioGroup
                aria-label="Victory Condition"
                name="victory-condition"
                value={state.victoryConditionId}
                onChange={event =>
                  dispatch({
                    type: 'SET_VICTORY',
                    payload: Number.parseInt((event.target as HTMLInputElement).value),
                  })
                }
              >
                {victoryConditions.map(condition => (
                  <FormControlLabel
                    key={`victory-condition-${condition.index}`}
                    value={condition.index}
                    control={<Radio checked={state.victoryConditionId === condition.index} />}
                    label={condition.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Divider />
            <UserAvatar
              small
              userId={props.participantA.userId}
              userAvatar={props.participantA.discordAvatar}
              userName={
                props.participantA.discordName + '#' + props.participantA.discordDiscriminator
              }
            />
            <br />
            <InputLabel id="roleA">Role</InputLabel>
            <Select
              id="roleA"
              value={state.deckARoleId}
              className={classes.inputField}
              onChange={event =>
                dispatch({
                  type: 'SET_ROLE_A',
                  payload: event.target.value as number | undefined,
                })
              }
            >
              <MenuItem value={undefined}>Can't remember</MenuItem>
              {roles.map(role => (
                <MenuItem value={role.index} key={role.index}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            <br />
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend">Splash</FormLabel>
              <RadioGroup
                aria-label="Splash Deck a"
                name="splash-deck-a"
                value={state.deckASplashId}
                onChange={event =>
                  dispatch({
                    type: 'SET_SPLASH_A',
                    payload: Number.parseInt((event.target as HTMLInputElement).value),
                  })
                }
              >
                <FormControlLabel
                  value={undefined}
                  control={<Radio checked={state.deckASplashId === undefined} />}
                  label="Can't remember"
                />
                {clans.map(clan => (
                  <FormControlLabel
                    key={`deck-a-splash-${clan.index}`}
                    value={clan.index}
                    control={<Radio checked={state.deckASplashId === clan.index} />}
                    label={
                      <span>
                        <ClanMon clanId={clan.index} small /> {clan.name}
                      </span>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Divider />
            <UserAvatar
              small
              userId={props.participantB.userId}
              userAvatar={props.participantB.discordAvatar}
              userName={
                props.participantB.discordName + '#' + props.participantB.discordDiscriminator
              }
            />
            <br />
            <InputLabel id="roleB">Role</InputLabel>
            <Select
              id="roleB"
              value={state.deckARoleId}
              className={classes.inputField}
              onChange={event =>
                dispatch({
                  type: 'SET_ROLE_B',
                  payload: event.target.value as number | undefined,
                })
              }
            >
              <MenuItem value={undefined}>Can't remember</MenuItem>
              {roles.map(role => (
                <MenuItem value={role.index} key={role.index}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            <br />
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend">Splash</FormLabel>
              <RadioGroup
                aria-label="Splash Deck b"
                name="splash-deck-b"
                value={state.deckBSplashId}
                onChange={event =>
                  dispatch({
                    type: 'SET_SPLASH_B',
                    payload: Number.parseInt((event.target as HTMLInputElement).value),
                  })
                }
              >
                <FormControlLabel
                  value={undefined}
                  control={<Radio checked={state.deckBSplashId === undefined} />}
                  label="Can't remember"
                />
                {clans.map(clan => (
                  <FormControlLabel
                    key={`deck-b-splash-${clan.index}`}
                    value={clan.index}
                    control={<Radio checked={state.deckBSplashId === clan.index} />}
                    label={
                      <span>
                        <ClanMon clanId={clan.index} small /> {clan.name}
                      </span>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
        <ButtonGroup className={classes.buttonGroup}>
          <Button color="inherit" variant="contained" onClick={() => props.onClose()}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={() => checkInputAndSubmit()}>
            Report Match!
          </Button>
        </ButtonGroup>
      </div>
    </Modal>
  )
}