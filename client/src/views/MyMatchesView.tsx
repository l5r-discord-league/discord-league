import React, { useContext } from 'react'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Container,
  Grid,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useMatchesForUser } from '../hooks/useMatchesForUser'
import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import { MatchCard } from '../components/MatchCard'
import { Match } from '../hooks/useTournamentPods'
import { UserContext } from '../App'

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

export function MyMatchesView(): JSX.Element {
  const classes = useStyles()
  const user = useContext(UserContext)
  const [matches, setMatches, participants, isLoading, error] = useMatchesForUser(user?.discordId)
  if (!user) {
    return (
      <Typography variant="h6" align="center">
        You need to be logged in to see your games.
      </Typography>
    )
  }

  if (isLoading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    )
  }

  if (error) {
    return (
      <Typography variant="h6" align="center">
        Error while loading data: {error}
      </Typography>
    )
  }

  function findParticipantById(participantId: number): ParticipantWithUserData {
    const result = participants.find(participant => participant.id === participantId)
    if (!result) {
      throw Error('The participating user was not found.')
    }
    return result
  }

  const { finished, unfinished } = groupMatches(matches)

  function updateMatch(updatedMatch: Match) {
    setMatches(matches.map(match => (match.id === updatedMatch.id ? updatedMatch : match)))
  }

  return matches && participants ? (
    <Container>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="unfinished-games-content"
          id="unfinished-games-header"
        >
          <Typography>Unfinished Matches</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionBody}>
          <Grid container spacing={1}>
            {unfinished.map(match => (
              <Grid item xs={12} md={6} lg={4} key={match.id}>
                <MatchCard
                  match={match}
                  participantA={findParticipantById(match.playerAId)}
                  participantB={findParticipantById(match.playerBId)}
                  updateMatch={updateMatch}
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
          <Typography>Finished Matches</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expansionBody}>
          <Grid container spacing={1}>
            {finished.map(match => (
              <Grid item xs={12} md={6} lg={4} key={match.id}>
                <MatchCard
                  match={match}
                  participantA={findParticipantById(match.playerAId)}
                  participantB={findParticipantById(match.playerBId)}
                  updateMatch={updateMatch}
                />
              </Grid>
            ))}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Container>
  ) : (
    <div />
  )
}
