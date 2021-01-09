import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Grid,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core'
import React from 'react'
import { MatchCard } from './MatchCard'
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import { Match } from '../hooks/useTournamentPod'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

function groupMatches(matches: Match[]) {
  return matches.reduce(
    (grouped, match) => {
      if (match.winnerId) {
        grouped.finished.push(match)
      } else {
        grouped.unfinished.push(match)
      }
      return grouped
    },
    { finished: [] as Match[], unfinished: [] as Match[] }
  )
}

export function TournamentMatchView(props: {
  matches: Match[]
  participants: ParticipantWithUserData[]
  updateMatch: (updatedMatch: Match) => void
}) {
  const classes = useStyles()
  function findParticipantById(participantId: number): ParticipantWithUserData {
    const result = props.participants.find((participant) => participant.id === participantId)
    if (!result) {
      throw Error('The participating user was not found.')
    }
    return result
  }

  const { finished, unfinished } = groupMatches(props.matches)

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="unfinished-games-content"
          id="unfinished-games-header"
        >
          <Typography>Unfinished Matches ({unfinished.length})</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionBody}>
          <Grid container spacing={2}>
            {unfinished.map((match) => (
              <Grid key={match.id} xs={12}>
                <MatchCard
                  match={match}
                  participantA={findParticipantById(match.playerAId)}
                  participantB={findParticipantById(match.playerBId)}
                  updateMatch={props.updateMatch}
                />
              </Grid>
            ))}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="finished-games-content"
          id="finished-games-header"
        >
          <Typography>Finished Matches ({finished.length})</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionBody}>
          <Grid container spacing={1}>
            {finished.map((match) => (
              <Grid key={match.id} xs={12}>
                <MatchCard
                  match={match}
                  participantA={findParticipantById(match.playerAId)}
                  participantB={findParticipantById(match.playerBId)}
                  updateMatch={props.updateMatch}
                />
              </Grid>
            ))}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}
