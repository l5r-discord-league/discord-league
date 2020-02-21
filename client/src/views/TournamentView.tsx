import React, { useState, useEffect } from 'react'
import { Tournament } from '../../../src/season/tournament'
import axios from 'axios'
import { TournamentRow, TournamentStatus } from '../components/TournamentRow'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export function TournamentView(): JSX.Element {
  const [tournaments, setTournaments] = useState<Tournament[]>([])

  useEffect(() => {
    // TODO use environment variable for api host
    axios.get('http://localhost:8080/api/tournament').then(resp => setTournaments(resp.data))
  })

  const ongoingTournaments = tournaments.filter(
    tournament =>
      tournament.status !== TournamentStatus.Upcoming &&
      tournament.status !== TournamentStatus.Finished
  )

  const finishedTournaments = tournaments.filter(
    tournament => tournament.status === TournamentStatus.Finished
  )

  const upcomingTournaments = tournaments.filter(
    tournament => tournament.status === TournamentStatus.Upcoming
  )

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
