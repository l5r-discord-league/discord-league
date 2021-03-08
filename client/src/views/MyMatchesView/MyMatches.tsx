import { ShortMatchData, User$findCurrent, User$findMatches } from '@dl/api'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { TournamentMatchView } from '../../components/TournamentMatchView'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

function getNumberOfUnfinishedMatches(matches: ShortMatchData[]): number {
  return matches.filter((match) => match.winnerId === null).length
}

export function MyMatches(props: {
  user: User$findCurrent['response']
  tournamentsWithMatches: User$findMatches['response']
}): JSX.Element {
  const classes = useStyles()

  return (
    <Container>
      {props.tournamentsWithMatches.map((tournamentWithMatches) => (
        <Accordion key={tournamentWithMatches.tournament.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="unfinished-games-content"
            id="unfinished-games-header"
          >
            <Typography>
              {tournamentWithMatches.tournament.name} (
              {getNumberOfUnfinishedMatches(tournamentWithMatches.matches)} unfinished)
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.expansionBody}>
            <TournamentMatchView
              matches={tournamentWithMatches.matches}
              participants={tournamentWithMatches.participants}
              onUpdate={() => window.location.reload()}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  )
}
