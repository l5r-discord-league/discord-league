import { MatchData } from '@dl/api'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import { MatchCard } from './MatchCard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

function groupMatches(matches: MatchData[]) {
  return matches.reduce(
    (grouped, match) => {
      if (match.winnerId) {
        grouped.finished.push(match)
      } else {
        grouped.unfinished.push(match)
      }
      return grouped
    },
    { finished: [] as MatchData[], unfinished: [] as MatchData[] }
  )
}

export function TournamentMatchView(props: {
  matches: MatchData[]
  participants: ParticipantWithUserData[]
  updateMatch: (updatedMatch: MatchData) => void
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
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="unfinished-games-content"
          id="unfinished-games-header"
        >
          <Typography>Unfinished Matches ({unfinished.length})</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.expansionBody}>
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
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="finished-games-content"
          id="finished-games-header"
        >
          <Typography>Finished Matches ({finished.length})</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.expansionBody}>
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
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
