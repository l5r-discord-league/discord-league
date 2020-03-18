import { Pod } from '../hooks/useTournamentPods'
import React from 'react'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
} from '@material-ui/core'
import { ClanMon } from './ClanMon'
import UserAvatar from './UserAvatar'
import { useHistory } from 'react-router-dom'

const colors = ['#163078', '#44c2bc', '#1d6922', '#dece23', '#de9923', '#ab1916', '#90119e']

function calculateRecordPerUser(
  pod: Pod
): { participantId: number; wins: number; losses: number }[] {
  return pod.participants.map(participant => {
    const matchesForParticipant = pod.matches.filter(
      match => match.playerAId === participant.id || match.playerBId === participant.id
    )
    const matchesWon = matchesForParticipant.filter(match => match.winnerId === participant.id)
    const matchesLost = matchesForParticipant.filter(
      match => match.winnerId && match.winnerId !== participant.id
    )
    return {
      participantId: participant.id,
      // To factor in groups smaller than 8
      wins: matchesWon.length + (8 - pod.participants.length),
      losses: matchesLost.length,
    }
  })
}

export function PodTable(props: { pod: Pod }) {
  const standingsPerUser = calculateRecordPerUser(props.pod)
  const history = useHistory()
  function recordStringForUser(userId: number) {
    const standing = standingsPerUser.find(standing => userId === standing.participantId)
    return `${standing?.wins} - ${standing?.losses}`
  }
  const sortedParticipants = props.pod.participants.sort((a, b) =>
    recordStringForUser(a.id) > recordStringForUser(b.id) ? -1 : 1
  )
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table" size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: colors[props.pod.id % 7] }}>
            <TableCell colSpan={3}>
              <Typography variant="h6">{props.pod.name}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Clan</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Record</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedParticipants.map(participant => (
            <TableRow
              key={participant.id}
              onClick={() => history.push('/user/' + participant.userId)}
              hover
            >
              <TableCell>
                <ClanMon clanId={participant.clanId} small />
              </TableCell>
              <TableCell>
                <UserAvatar
                  userId={participant.userId}
                  userAvatar={participant.discordAvatar}
                  userName={participant.discordName + '#' + participant.discordDiscriminator}
                  small
                />
              </TableCell>
              <TableCell>{recordStringForUser(participant.id)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
