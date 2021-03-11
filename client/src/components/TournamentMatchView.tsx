import { ExtendedMatch } from '@dl/api'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  Grid,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { MatchCard } from './MatchCard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

export function TournamentMatchView(props: {
  matchesDone: ExtendedMatch[]
  matchesToPlay: ExtendedMatch[]
  onUpdate: () => void
}) {
  const classes = useStyles()

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="unfinished-games-content"
          id="unfinished-games-header"
        >
          <Typography>Unfinished Matches ({props.matchesToPlay.length})</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.expansionBody}>
          <Grid container spacing={2}>
            {props.matchesToPlay.map((match) => (
              <Grid key={match.id} xs={12}>
                <MatchCard
                  match={match}
                  participantA={match.participantA}
                  participantB={match.participantB}
                  onReportSuccess={props.onUpdate}
                  onReportDelete={props.onUpdate}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="finished-games-content"
          id="finished-games-header"
        >
          <Typography>Finished Matches ({props.matchesDone.length})</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.expansionBody}>
          <Grid container spacing={1}>
            {props.matchesDone.map((match) => (
              <Grid key={match.id} xs={12}>
                <MatchCard
                  match={match}
                  participantA={match.participantA}
                  participantB={match.participantB}
                  onReportSuccess={props.onUpdate}
                  onReportDelete={props.onUpdate}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
