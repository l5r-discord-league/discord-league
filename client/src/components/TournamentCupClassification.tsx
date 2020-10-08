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
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'

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
  participants: ParticipantWithUserData[]
  currentUser: any
  dispatch: React.Dispatch<Action>
}> = props =>
  props.participants.length === 0 ? null : (
    <div style={{ marginBottom: 10 }}>
      <Typography variant="h4">{props.title}</Typography>
      <TableContainer component={Paper}>
        <Table aria-label={`${props.title} decklists`}>
          <TableBody>
            {props.participants.map(participant => {
              const decklist = props.decklists.find(d => d.participantId === participant.id)
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

export const TournamentCupClassification: React.FC<{
  tournamentId: number
  participants: ParticipantWithUserData[]
}> = React.memo(({ tournamentId, participants }) => {
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

  const [goldParticipants, silverParticipants] = groupByCup(participants)
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
        <SubmitDecklistModal onCancel={() => dispatch({ type: 'closeModal' })} onConfirm={submit} />
      )}
    </Container>
  )
})
