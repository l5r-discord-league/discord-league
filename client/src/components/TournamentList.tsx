import React from 'react'
import { TournamentRecord } from '../views/TournamentView'
import { TournamentRow } from './TournamentRow'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export function TournamentList(props: { label: string; tournaments: TournamentRecord[] }) {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={props.label.toLowerCase + '-tournaments-content'}
        id={props.label.toLowerCase + '-tournaments-header'}
      >
        <Typography>{props.label} Tournaments</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{
          backgroundColor: 'grey',
        }}
      >
        {props.tournaments.map(tournament => (
          <TournamentRow tournament={tournament} key={tournament.id} />
        ))}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
