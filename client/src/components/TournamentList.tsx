import React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { Tournament } from '../hooks/useTournaments'
import { TournamentRow } from './TournamentRow'

export function TournamentList(props: { label: string; tournaments: Tournament[] }) {
  return (
    <ExpansionPanel color="primary">
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={props.label.toLowerCase + '-tournaments-content'}
        id={props.label.toLowerCase + '-tournaments-header'}
      >
        <Typography>{props.label} Tournaments</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {props.tournaments.map(tournament => (
          <TournamentRow tournament={tournament} key={tournament.id} />
        ))}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
