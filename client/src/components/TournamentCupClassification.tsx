import React from 'react'
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core'
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import { UserAvatarAndClan } from './UserAvatarAndClan'

function groupByCup(participants: ParticipantWithUserData[]) {
  return participants
    .sort((a, b) => a.clanId - b.clanId)
    .reduce<[ParticipantWithUserData[], ParticipantWithUserData[]]>(
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

function ParticipantRow({ participant }: { participant: ParticipantWithUserData }) {
  return (
    <TableRow key={participant.id}>
      <TableCell>
        <UserAvatarAndClan user={participant} />
      </TableCell>
      <TableCell>
        {participant.discordName}#{participant.discordDiscriminator}
      </TableCell>
    </TableRow>
  )
}

export function TournamentCupClassification({
  participants,
}: {
  participants: ParticipantWithUserData[]
}) {
  const [gold, silver] = groupByCup(participants)
  return (
    <Container>
      <Typography variant="h4">Gold Cup</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Gold Cup players">
          <TableBody>
            {gold.map(participant => (
              <ParticipantRow participant={participant} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h4">Silver Cup</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="Silver Cup players">
          <TableBody>
            {silver.map(participant => (
              <ParticipantRow participant={participant} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
