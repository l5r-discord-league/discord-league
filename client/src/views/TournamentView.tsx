import React from 'react'
import { Paper } from '@material-ui/core'

import { TournamentList } from '../components/TournamentList'
import { useTournaments, Tournament } from '../hooks/useTournaments'

function groupTournaments(tournaments: Tournament[]) {
  return tournaments.reduce(
    (grouped, tournament) => {
      switch (tournament.statusId) {
        case 'finished':
          grouped.finished.push(tournament)
          break
        case 'upcoming':
          grouped.upcoming.push(tournament)
          break
        default:
          grouped.ongoing.push(tournament)
      }
      return grouped
    },
    { ongoing: [] as Tournament[], finished: [] as Tournament[], upcoming: [] as Tournament[] }
  )
}

export function TournamentView() {
  const tournaments = useTournaments()
  const { upcoming, ongoing, finished } = groupTournaments(tournaments)
  return (
    <Paper>
      <TournamentList label="Upcoming" tournaments={upcoming} />
      <TournamentList label="Ongoing" tournaments={ongoing} />
      <TournamentList label="Finished" tournaments={finished} />
    </Paper>
  )
}
