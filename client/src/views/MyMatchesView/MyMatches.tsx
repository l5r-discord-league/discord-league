import { ParticipantWithUserData, ShortMatchData, Tournament } from '@dl/api'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  tournament: Tournament
  matches: ShortMatchData[]
  participants: ParticipantWithUserData[]
  onUpdate: () => void
}): JSX.Element {
  const classes = useStyles()

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="unfinished-games-content"
        id="unfinished-games-header"
      >
        <Typography>
          {props.tournament.name} ({getNumberOfUnfinishedMatches(props.matches)} unfinished)
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.expansionBody}>
        <TournamentMatchView
          matches={props.matches}
          participants={props.participants}
          onUpdate={props.onUpdate}
        />
      </AccordionDetails>
    </Accordion>
  )
}
