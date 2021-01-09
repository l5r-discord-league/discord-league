import React, { useContext } from 'react'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Container,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useMatchesForUser } from '../hooks/useMatchesForUser'
import { Match } from '../hooks/useTournamentPod'
import { UserContext } from '../App'
import { TournamentMatchView } from '../components/TournamentMatchView'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

export function MyMatchesView(): JSX.Element {
  const classes = useStyles()
  const user = useContext(UserContext)
  const [tournamentsWithMatches, setTournamentsWithMatches, isLoading, error] = useMatchesForUser(
    user?.discordId
  )
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

  function updateMatchArray(matches: Match[], updatedMatch: Match) {
    return matches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match))
  }

  function updateMatch(updatedMatch: Match) {
    setTournamentsWithMatches(
      tournamentsWithMatches.map((tournamentWithMatches) => {
        return {
          tournament: tournamentWithMatches.tournament,
          matches: updateMatchArray(tournamentWithMatches.matches, updatedMatch),
          participants: tournamentWithMatches.participants,
        }
      })
    )
  }

  function getNumberOfUnfinishedMatches(matches: Match[]): number {
    const unfinished = matches.filter((match) => match.winnerId === null)
    return unfinished ? unfinished.length : 0
  }

  const sortedTournaments = tournamentsWithMatches.sort((a, b) => b.tournament.id - a.tournament.id)

  return tournamentsWithMatches ? (
    <Container>
      {sortedTournaments.map((tournamentWithMatches) => (
        <ExpansionPanel key={tournamentWithMatches.tournament.id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="unfinished-games-content"
            id="unfinished-games-header"
          >
            <Typography>
              {tournamentWithMatches.tournament.name} (
              {getNumberOfUnfinishedMatches(tournamentWithMatches.matches)} unfinished)
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.expansionBody}>
            <TournamentMatchView
              matches={tournamentWithMatches.matches}
              participants={tournamentWithMatches.participants}
              updateMatch={updateMatch}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </Container>
  ) : (
    <div />
  )
}
