import React, { useContext, useState } from 'react'
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

function DecklistRow({ decklist, currentUser }: { decklist: Decklist; currentUser: any }) {
  return (
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
        {(isAdmin(currentUser) || currentUser?.discordId === decklist.discordId) &&
          (decklist.link ? (
            <Chip clickable label="Edit decklist" variant="outlined" onClick={() => {}} />
          ) : (
            <Chip clickable label="Submit decklist" variant="outlined" onClick={() => {}} />
          ))}
      </TableCell>
    </TableRow>
  )
}

export function TournamentCupClassification({ tournamentId }: { tournamentId: number }) {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const currentUser = useContext(UserContext)
  const [decklistFetching] = useTournamentDecklists(tournamentId)
  if (!decklistFetching.data) {
    return null
  }

  const [gold, silver] = groupByCup(decklistFetching.data)

  return (
    <Container>
      <Typography variant="h4">Gold Cup</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Gold Cup players">
          <TableBody>
            {gold.map(decklist => (
              <DecklistRow decklist={decklist} currentUser={currentUser} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h4">Silver Cup</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Silver Cup players">
          <TableBody>
            {silver.map(decklist => (
              <DecklistRow decklist={decklist} currentUser={currentUser} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isModalOpen && (
        <SubmitDecklistModal onCancel={() => setIsModalOpen(false)} onConfirm={() => {}} />
      )}
    </Container>
  )
}
