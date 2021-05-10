import { ParticipantWithUserData, PodResult, RankedParticipant, UserRowData } from '@dl/api'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useCallback } from 'react'

import { MatchCard } from '../../components/MatchCard'
import { PodTable } from '../../components/PodTable'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headline: {
      padding: theme.spacing(1),
    },
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

const userFindParticipantById = (participants: RankedParticipant[]) =>
  useCallback(
    (participantId: number) => {
      const result = participants.find((participant) => participant.id === participantId)
      if (!result) {
        throw Error('The participating user was not found.')
      }
      return result
    },
    [participants]
  )

export function PodDetail(props: {
  pod: PodResult
  users: UserRowData[]
  onDrop: (participant: ParticipantWithUserData) => void
}) {
  const classes = useStyles()
  const findParticipantById = userFindParticipantById(props.pod.participants)

  return (
    <Container className={classes.headline}>
      <Paper>
        <Typography variant="h5" align="center">
          Details for Pod {props.pod.name}
        </Typography>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PodTable users={props.users} pod={props.pod} onDrop={props.onDrop} detailed />
            </Grid>
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="finished-games-content"
                  id="finished-games-header"
                >
                  <Typography>Matches</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.expansionBody}>
                  <Grid container spacing={1}>
                    {props.pod.matches.map((match) => (
                      <Grid item xs={12} key={match.id}>
                        <MatchCard
                          key={match.id}
                          match={match}
                          participantA={findParticipantById(match.playerAId)}
                          participantB={findParticipantById(match.playerBId)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </Container>
  )
}
