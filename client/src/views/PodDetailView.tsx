import React, { useReducer } from 'react'
import { request } from '../utils/request'
import { useParams } from 'react-router-dom'
import { useTournamentPod } from '../hooks/useTournamentPod'
import {
  Container,
  Paper,
  Typography,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core'
import { PodTable } from '../components/PodTable'
import { MatchCard } from '../components/MatchCard'
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { ConfirmParticipantDrop } from '../modals/ConfirmParticipantDrop'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headline: {
      padding: theme.spacing(1),
    },
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

interface State {
  isDropConfirmationOpen: boolean
  participantBeingDroped?: ParticipantWithUserData
  error?: string
}
type Action =
  | { type: 'confirmDrop'; payload: ParticipantWithUserData }
  | { type: 'dropError'; payload: string }
  | { type: 'closeConfirmation' }

const initialState: State = { isDropConfirmationOpen: false }
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'confirmDrop':
      return {
        isDropConfirmationOpen: true,
        participantBeingDroped: action.payload,
      }
    case 'closeConfirmation':
      return { isDropConfirmationOpen: false }
    case 'dropError':
      return { isDropConfirmationOpen: false, error: action.payload }
    default:
      return state
  }
}

async function dropParticipant(participantId: number) {
  return request.post(`/api/participant/${participantId}/drop`)
}

export function PodDetailView() {
  const classes = useStyles()
  const { id } = useParams() as { id: string }
  const [pod, isLoading, requestError] = useTournamentPod(id)
  const [state, dispatch] = useReducer(reducer, initialState)

  if (state.error) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          Error: {state.error}
        </Typography>
      </Container>
    )
  } else if (requestError) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          Error while retrieving pod: {requestError}
        </Typography>
      </Container>
    )
  } else if (isLoading) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          Loading...
        </Typography>
      </Container>
    )
  } else if (!pod) {
    return (
      <Container>
        <Typography variant="h5" align="center">
          No data found.
        </Typography>
      </Container>
    )
  }

  function findParticipantById(participantId: number): ParticipantWithUserData {
    const result = pod?.participants.find((participant) => participant.id === participantId)
    if (!result) {
      throw Error('The participating user was not found.')
    }
    return result
  }

  return (
    <>
      <Container className={classes.headline}>
        <Paper>
          <Typography variant="h5" align="center">
            Details for Pod {pod.name}
          </Typography>
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PodTable
                  pod={pod}
                  onDrop={(participant: ParticipantWithUserData) => {
                    dispatch({ type: 'confirmDrop', payload: participant })
                  }}
                  detailed
                />
              </Grid>
              <Grid item xs={12}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="finished-games-content"
                    id="finished-games-header"
                  >
                    <Typography>Matches</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.expansionBody}>
                    <Grid container spacing={1}>
                      {pod.matches.map((match) => (
                        <Grid item xs={12} key={match.id}>
                          <MatchCard
                            key={match.id}
                            match={match}
                            participantA={findParticipantById(match.playerAId)}
                            participantB={findParticipantById(match.playerBId)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Container>

      {state.isDropConfirmationOpen && state.participantBeingDroped && (
        <ConfirmParticipantDrop
          participant={state.participantBeingDroped}
          onCancel={() => dispatch({ type: 'closeConfirmation' })}
          onConfirm={() => {
            const participantId = state.participantBeingDroped?.id
            if (participantId == null) {
              return dispatch({ type: 'dropError', payload: 'Error!' }) // If this fired the state somehow got broken
            }

            try {
              dropParticipant(participantId)
            } catch (error) {
              dispatch({ type: 'dropError', payload: error })
            } finally {
              dispatch({ type: 'closeConfirmation' })
              window.location.reload() // Just reload to fetch the newest data. Not the best, but good enough
            }
          }}
        />
      )}
    </>
  )
}
