import React from 'react'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { Tournament } from '../hooks/useTournaments'
import { TournamentRow } from './TournamentRow'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expansionBody: {
      backgroundColor: theme.palette.grey[300],
      padding: theme.spacing(2),
    },
  })
)

export function TournamentList(props: { label: string; tournaments: Tournament[] }) {
  const classes = useStyles()

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={props.label.toLowerCase + '-tournaments-content'}
        id={props.label.toLowerCase + '-tournaments-header'}
      >
        <Typography>{props.label} Tournaments</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionBody}>
        <Grid container spacing={2} direction="column">
          {props.tournaments.map((tournament) => (
            <TournamentRow tournament={tournament} key={tournament.id} />
          ))}
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
