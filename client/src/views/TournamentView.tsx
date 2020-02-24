import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TournamentRow } from '../components/TournamentRow'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export type TournamentType = 'monthly'

export type TournamentStatus = 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'

export interface TournamentRecord {
  id: number
  name: string
  start_date: string
  status_id: TournamentStatus
  type_id: TournamentType
  description?: string
  createdAt: Date
  updatedAt: Date
}

export function TournamentView(): JSX.Element {
  const [tournaments, setTournaments] = useState<TournamentRecord[]>([])

  useEffect(() => {
    axios.get('/api/tournament').then(resp => setTournaments(resp.data))
  }, [])

  const ongoingTournaments = tournaments.filter(
    tournament => tournament.status_id !== 'upcoming' && tournament.status_id !== 'finished'
  )

  const finishedTournaments = tournaments.filter(tournament => tournament.status_id === 'finished')

  const upcomingTournaments = tournaments.filter(tournament => tournament.status_id === 'upcoming')

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="upcoming-tournaments-content"
          id="upcoming-tournaments-header"
        >
          <Typography>Upcoming Tournaments</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {upcomingTournaments.map(tournament => (
            <TournamentRow tournament={tournament} key={tournament.id} />
          ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="ongoing-tournaments-content"
          id="ongoing-tournaments-header"
        >
          <Typography>Ongoing Tournaments</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {ongoingTournaments.map(tournament => (
            <TournamentRow tournament={tournament} key={tournament.id} />
          ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="finished-tournaments-content"
          id="finished-tournaments-header"
        >
          <Typography>Finished Tournaments</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {finishedTournaments.map(tournament => (
            <TournamentRow tournament={tournament} key={tournament.id} />
          ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}
