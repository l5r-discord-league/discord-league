import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useCallback, useReducer } from 'react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '../components/EmptyState'
import { Loading } from '../components/Loading'
import { MatchCard } from '../components/MatchCard'
import { PodTable } from '../components/PodTable'
import { RequestError } from '../components/RequestError'
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import { useTournamentPod } from '../hooks/useTournamentPod'
import { useUsers } from '../hooks/useUsers'
import { ConfirmParticipantDrop } from '../modals/ConfirmParticipantDrop'
import { request } from '../utils/request'

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
  participantBeingDroped?: {
    userId: string
    discordName: string
    discordDiscriminator: string
    id: number
  }
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
  const { id } = useParams<{ id: string }>()
  const users = useUsers()
  const classes = useStyles()
  const [podState, refetchPod] = useTournamentPod(id)
  const [state, dispatch] = useReducer(reducer, initialState)
  const findParticipantById = useCallback(
    (participantId: number) => {
      const result = podState.data?.participants.find(
        (participant) => participant.id === participantId
      )
      if (!result) {
        throw Error('The participating user was not found.')
      }
      return result
    },
    [podState.data]
  )

  if (typeof state.error === 'string') {
    return <RequestError requestError={state.error} />
  }
  if (typeof podState.error === 'string') {
    return <RequestError requestError={podState.error} />
  }
  if (podState.loading) {
    return <Loading />
  }
  if (podState.data == null) {
    return <EmptyState />
  }

  return (
    <>
      <Container className={classes.headline}>
        <Paper>
          <Typography variant="h5" align="center">
            Details for Pod {podState.data.name}
          </Typography>
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PodTable
                  users={users}
                  pod={podState.data}
                  onDrop={(participant: any) => {
                    dispatch({ type: 'confirmDrop', payload: participant })
                  }}
                  detailed
                />
              </Grid>
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="finished-games-content"
                    id="finished-games-header"
                  >
                    <Typography>Matches</Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.expansionBody}>
                    <Grid container spacing={1}>
                      {podState.data.matches.map((match) => (
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
                  </AccordionDetails>
                </Accordion>
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
              refetchPod()
            }
          }}
        />
      )}
    </>
  )
}
