import React from 'react'
import { useTournament } from '../hooks/useTournament'
import { useParams } from 'react-router-dom'
import { Container, Paper } from '@material-ui/core'
import { TournamentParticipationPanel } from '../components/TournamentParticipationPanel'
import { TournamentAdminPanel } from '../components/TournamentAdminPanel'
import { TournamentHeaderPanel } from '../components/TournamentHeaderPanel'
import { TournamentPodPanel } from '../components/TournamentPodPanel'

export function TournamentDetailView() {
  const { id } = useParams()
  const [tournament, setTournament, requestError, isLoading] = useTournament(id)

  if (requestError) {
    return <h5>Error while retrieving tournament: {requestError}</h5>
  }
  if (isLoading) {
    return <h5>Loading...</h5>
  }
  if (tournament) {
    return (
      <div>
        <Container>
          <Paper>
            <TournamentHeaderPanel tournament={tournament} />
            {tournament.statusId !== 'upcoming' && (
              <TournamentPodPanel tournamentId={tournament.id} />
            )}
            <TournamentAdminPanel tournament={tournament} onTournamentUpdate={setTournament} />
            <TournamentParticipationPanel tournament={tournament} />
          </Paper>
        </Container>
      </div>
    )
  }

  return <div>No data found.</div>
}
