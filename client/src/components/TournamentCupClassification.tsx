import React, { useCallback, useContext, useReducer, useState } from 'react'
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
import { UserAvatarAndClan } from './UserAvatarAndClan'
import { Decklist, useTournamentDecklists } from '../hooks/useTournamentDecklists'
import { isAdmin } from '../hooks/useUsers'
import { UserContext } from '../App'
import { request } from '../utils/request'
import { SubmitDecklistModal } from '../modals/SubmitDecklistModal'

function groupByCup(participants: Decklist[]) {
  return participants
    .sort((a, b) => a.clanId - b.clanId)
    .reduce<[Decklist[], Decklist[]]>(
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

function editDecklist(participantId: number, data: { link: string; decklist: string }) {
  return request
    .put(`/api/participant/${participantId}/decklist`, data)
    .then(response => response.data)
}
function createDecklist(participantId: number, data: { link: string; decklist: string }) {
  return request
    .post(`/api/participant/${participantId}/decklist`, data)
    .then(response => response.data)
}

const DecklistsTable: React.FC<{
  title: string
  decklists: Decklist[]
  currentUser: any
  dispatch: React.Dispatch<Action>
}> = props => (
  <div style={{ marginBottom: 10 }}>
    <Typography variant="h4">{props.title}</Typography>
    <TableContainer component={Paper}>
      <Table aria-label={`${props.title} decklists`}>
        <TableBody>
          {props.decklists.map(decklist => (
            <TableRow key={decklist.participantId}>
              <TableCell>
                <UserAvatarAndClan user={decklist} />
              </TableCell>
              <TableCell>
                <a href={decklist.link} target="_blank" rel="noopener noreferrer">
                  Decklist
                </a>
              </TableCell>
              <TableCell>
                {(isAdmin(props.currentUser) ||
                  props.currentUser?.discordId === decklist.discordId) &&
                  (decklist.link ? (
                    <Chip
                      clickable
                      label="Edit decklist"
                      variant="outlined"
                      onClick={() =>
                        props.dispatch({
                          type: 'openModal',
                          participantId: decklist.participantId,
                          change: 'edit',
                        })
                      }
                    />
                  ) : (
                    <Chip
                      clickable
                      label="Submit decklist"
                      variant="outlined"
                      onClick={() =>
                        props.dispatch({
                          type: 'openModal',
                          participantId: decklist.participantId,
                          change: 'create',
                        })
                      }
                    />
                  ))}
              </TableCell>
            </TableRow>
          ))}
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

export function TournamentCupClassification({ tournamentId }: { tournamentId: number }) {
  const currentUser = useContext(UserContext)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [decklistFetching, refreshDecklists] = useTournamentDecklists(tournamentId)
  const submit = useCallback(
    (decklist: { link: string; decklist: string }) => {
      if (state.participantId == null || state.change == null) {
        return
      }
      ;(state.change === 'create' ? createDecklist : editDecklist)(
        state.participantId,
        decklist
      ).then(() => {
        dispatch({ type: 'closeModal' })
        refreshDecklists()
      })
    },
    [state.participantId, state.change, dispatch, refreshDecklists]
  )
  if (!decklistFetching.data) {
    return null
  }

  const [gold, silver] = groupByCup(decklistFetching.data)

  return (
    <Container>
      <DecklistsTable
        title="Gold Cup"
        decklists={gold}
        currentUser={currentUser}
        dispatch={dispatch}
      />
      <DecklistsTable
        title="Silver Cup"
        decklists={silver}
        currentUser={currentUser}
        dispatch={dispatch}
      />
      {state.isModalOpen && (
        <SubmitDecklistModal onCancel={() => dispatch({ type: 'closeModal' })} onConfirm={submit} />
      )}
    </Container>
  )
}
