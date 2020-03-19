import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import React from 'react'
import { Match } from '../hooks/useTournamentPods'
import {
  Card,
  Typography,
  Grid,
  Box,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from '@material-ui/core'
import UserAvatar from './UserAvatar'
import { CountdownTimer } from './CountdownTimer'
import { ClanMon } from './ClanMon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    matchContainer: {
      padding: theme.spacing(1),
    },
    centeredContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  })
)

export function MatchCard(props: {
  match: Match
  participantA: ParticipantWithUserData
  participantB: ParticipantWithUserData
}) {
  const classes = useStyles()
  const deadline = new Date(props.match.deadline)
  return (
    <Card>
      <Box className={classes.matchContainer}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <ClanMon clanId={props.match.deckAClanId} />
          </Grid>
          <Grid item xs={6}>
            <UserAvatar
              userId={props.participantA.userId}
              userAvatar={props.participantA.discordAvatar}
              userName={
                props.participantA.discordName + '#' + props.participantA.discordDiscriminator
              }
            />
          </Grid>
          <Grid item xs={5} className={classes.centeredContainer} justify="space-between">
            {props.match.winnerId === props.participantA.id && (
              <Typography color="error">WINNER!</Typography>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={3}>
            <Typography color="primary" align="center">
              VERSUS
            </Typography>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={6}>
            {!props.match.winnerId && (
              <div>
                <Typography align="right">
                  Deadline <CountdownTimer deadline={deadline} timeOutMessage="is over!" />
                </Typography>
              </div>
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={1}>
            <ClanMon clanId={props.match.deckBClanId} />
          </Grid>
          <Grid item xs={6}>
            <UserAvatar
              userId={props.participantB.userId}
              userAvatar={props.participantB.discordAvatar}
              userName={
                props.participantB.discordName + '#' + props.participantB.discordDiscriminator
              }
            />
          </Grid>
          <Grid item xs={5} className={classes.centeredContainer} justify="space-between">
            {props.match.winnerId === props.participantB.id ? (
              <Typography color="error">WINNER!</Typography>
            ) : (
              <div />
            )}
            {!props.match.winnerId && (
              <Button color="primary" variant="contained">
                Report Match
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}
