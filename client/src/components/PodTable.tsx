import { Pod } from '../hooks/useTournamentPods'
import React, { useCallback, useContext } from 'react'
import {
  Button,
  Chip,
  createStyles,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { ClanMon } from './ClanMon'
import UserAvatar from './UserAvatar'
import { useHistory } from 'react-router-dom'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { UserContext } from '../App'
import { isAdmin } from '../hooks/useUsers'
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'

const colors = ['#4a74e8', '#44c2bc', '#30b339', '#dece23', '#de9923', '#e04946', '#d35ce0']

const useStyles = makeStyles(() =>
  createStyles({
    sticky: {
      position: 'sticky',
    },
    name: {
      overflowWrap: 'anywhere',
    },
  })
)

export function PodTable(props: {
  pod: Pod
  onDrop?: (participant: ParticipantWithUserData) => void
  podLink?: boolean
}) {
  const classes = useStyles()
  const history = useHistory()
  const currentUser = useContext(UserContext)

  const navigateToPod = useCallback(() => {
    history.push(`/pod/${props.pod.id}`)
  }, [history, props.pod.id])

  const sortedParticipants = props.pod.records
    .slice()
    .sort((a, b) => {
      const dropSort = Number(a.dropped) - Number(b.dropped)
      const winsSort = b.wins - a.wins
      const lossesSort = b.losses - a.losses
      return dropSort !== 0 ? dropSort : winsSort !== 0 ? winsSort : lossesSort
    })
    .flatMap(record => {
      const participant = props.pod.participants.find(({ id }) => id === record.participantId)
      if (!participant) {
        return []
      }
      return { ...participant, wins: record.wins, losses: record.losses }
    })

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table" size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: colors[props.pod.id % colors.length] }}>
            <TableCell colSpan={4}>
              <Typography variant="h6">
                {props.pod.name}
                {props.podLink && (
                  <Button onClick={navigateToPod}>
                    <ExitToAppIcon /> Details
                  </Button>
                )}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.sticky}>Clan</TableCell>
            <TableCell>User</TableCell>
            <TableCell className={classes.sticky}>Record</TableCell>
            {props.onDrop && <TableCell className={classes.sticky} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedParticipants.map(participant => (
            <TableRow key={participant.id}>
              <TableCell className={classes.sticky}>
                <ClanMon clanId={participant.clanId} small />
              </TableCell>
              <TableCell
                className={classes.name}
                onClick={() => history.push('/user/' + participant.userId)}
              >
                <UserAvatar
                  userId={participant.userId}
                  userAvatar={participant.discordAvatar}
                  userName={`${participant.dropped ? '💧 ' : ''}${participant.discordName}#${
                    participant.discordDiscriminator
                  } `}
                  small
                />
              </TableCell>
              <TableCell className={classes.sticky}>
                {`${participant.wins} - ${participant.losses}`}
              </TableCell>
              {props.onDrop && (
                <TableCell className={classes.sticky} style={{ width: 60, textAlign: 'center' }}>
                  {!participant.dropped &&
                    (isAdmin(currentUser) || participant.userId === currentUser?.discordId) && (
                      <Chip
                        label="Drop"
                        icon={
                          <span role="img" aria-label="Drop">
                            💧
                          </span>
                        }
                        variant="outlined"
                        clickable
                        onClick={() => {
                          if (typeof props.onDrop === 'function') {
                            props.onDrop(participant)
                          }
                        }}
                      />
                    )}
                </TableCell>
              )}
            </TableRow>
          ))}
          {sortedParticipants.length < 8 && (
            <TableRow>
              <TableCell className={classes.sticky}>
                <ClanMon clanId={0} small />
              </TableCell>
              <TableCell className={classes.name}>---</TableCell>
              <TableCell className={classes.sticky}>0 - 7</TableCell>
              {props.onDrop && <TableCell className={classes.sticky} />}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
