import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { TournamentList } from '../components/TournamentList'
import { Paper } from '@material-ui/core'

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
    <Paper>
      <TournamentList label="Upcoming" tournaments={upcomingTournaments} />
      <TournamentList label="Ongoing" tournaments={ongoingTournaments} />
      <TournamentList label="Finished" tournaments={finishedTournaments} />
    </Paper>
  )
}
