import React, { useState, useEffect } from 'react'
import { Tournament } from '../../../src/season/tournament'
import axios from 'axios'
import { TournamentRow, TournamentStatus } from '../components/TournamentRow'
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {},
}))

export function TournamentView(): JSX.Element {
  const [tournaments, setTournaments] = useState([] as Array<Tournament>)
  const classes = useStyles()

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
          <Typography className={classes.heading}>Upcoming Tournaments</Typography>
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
          <Typography className={classes.heading}>Ongoing Tournaments</Typography>
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
          <Typography className={classes.heading}>Finished Tournaments</Typography>
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
