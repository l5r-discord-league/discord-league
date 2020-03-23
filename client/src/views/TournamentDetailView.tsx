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
    return (
      <Container>
        <h5>Error while retrieving tournament: {requestError}</h5>
      </Container>
    )
  }
  if (isLoading) {
    return (
      <Container>
        <h5>Loading...</h5>
      </Container>
    )
  }
  if (tournament) {
    return (
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
    )
  }

  return <Container>No data found.</Container>
}
