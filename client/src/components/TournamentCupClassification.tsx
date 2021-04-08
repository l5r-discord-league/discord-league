import { Decklist, ParticipantWithUserData } from '@dl/api'
import { memo, useCallback, useContext, useReducer } from 'react'
import {
  Chip,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core'

import { api } from '../api'
import { UserContext } from '../App'
import { useTournamentDecklists } from '../hooks/useTournamentDecklists'
import { isAdmin } from '../hooks/useUsers'
import { SubmitDecklistModal } from '../modals/SubmitDecklistModal'
import { UserAvatarAndClan } from './UserAvatar/UserAvatar'

function groupByCup<P extends { clanId: number; bracket: 'goldCup' | 'silverCup' | null }>(
  players: P[]
) {
  return players
    .sort((a, b) => a.clanId - b.clanId)
    .reduce<[P[], P[]]>(
      (cups, participant) => {
        if (participant.bracket === 'goldCup') {
          cups[0].push(participant)
        } else if (participant.bracket === 'silverCup') {
          cups[1].push(participant)
        }
        return cups
      },
      [[], []]
    )
}

const DecklistsTable: React.FC<{
  title: string
  decklists: Decklist[]
  participants: ParticipantWithUserData[]
  currentUser: any
  dispatch: React.Dispatch<Action>
}> = (props) =>
  props.participants.length === 0 ? null : (
    <div style={{ marginBottom: 10 }}>
      <Typography variant="h4">{props.title}</Typography>
      <TableContainer component={Paper}>
        <Table aria-label={`${props.title} decklists`}>
          <TableBody>
            {props.participants.map((participant) => {
              const decklist = props.decklists.find((d) => d.participantId === participant.id)
              return (
                <TableRow key={participant.id}>
                  <TableCell width="60%">
                    <UserAvatarAndClan user={participant} />
                  </TableCell>
                  <TableCell width="20%" align="right">
                    {decklist && (
                      <a href={decklist.link} target="_blank" rel="noopener noreferrer">
                        Decklist
                      </a>
                    )}
                  </TableCell>
                  <TableCell width="20%" align="right">
                    {(isAdmin(props.currentUser) ||
                      (!decklist?.locked &&
                        props.currentUser?.discordId === participant.discordId)) && (
                      <Chip
                        clickable
                        label={decklist ? 'Edit decklist' : 'Submit decklist'}
                        variant="outlined"
                        onClick={() =>
                          props.dispatch({
                            type: 'openModal',
                            participantId: participant.id,
                            change: decklist ? 'edit' : 'create',
                          })
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

interface State {
  isModalOpen: boolean
  change?: 'create' | 'edit'
  participantId?: number
}

const initialState = { isModalOpen: false }

type Action =
  | { type: 'openModal'; change: 'create' | 'edit'; participantId: number }
  | { type: 'closeModal' }
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'openModal':
      return { isModalOpen: true, change: action.change, participantId: action.participantId }
    case 'closeModal':
      return { isModalOpen: false }
  }
}

export const TournamentCupClassification = memo(
  (props: { tournamentId: number; participants: ParticipantWithUserData[] }) => {
    const currentUser = useContext(UserContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [decklistFetching, refreshDecklists] = useTournamentDecklists(props.tournamentId)
    const submit = useCallback(
      async (decklist: { link: string; decklist: string }) => {
        if (state.participantId != null && state.change != null) {
          const params = { participantId: state.participantId, body: decklist }
          if (state.change === 'create') {
            await api.Decklist.createForParticipant(params)
          } else {
            await api.Decklist.updateForParticipant(params)
          }

          dispatch({ type: 'closeModal' })
          refreshDecklists()
        }
      },
      [state.participantId, state.change, dispatch, refreshDecklists]
    )
    if (!decklistFetching.data) {
      return null
    }

    const [goldParticipants, silverParticipants] = groupByCup(props.participants)
    const [goldDecklists, silverDecklists] = groupByCup(decklistFetching.data)

    return (
      <Container>
        <DecklistsTable
          title="Gold Cup"
          decklists={goldDecklists}
          participants={goldParticipants}
          currentUser={currentUser}
          dispatch={dispatch}
        />
        <DecklistsTable
          title="Silver Cup"
          decklists={silverDecklists}
          participants={silverParticipants}
          currentUser={currentUser}
          dispatch={dispatch}
        />
        {state.isModalOpen && (
          <SubmitDecklistModal
            onCancel={() => dispatch({ type: 'closeModal' })}
            onConfirm={submit}
          />
        )}
      </Container>
    )
  }
)
