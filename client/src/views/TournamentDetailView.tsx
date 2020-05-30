import React, { useCallback, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Container, createStyles, Fab, makeStyles, Paper, Theme } from '@material-ui/core'

import { UserContext } from '../App'
import { TournamentAdminPanel } from '../components/TournamentAdminPanel'
import { TournamentHeaderPanel } from '../components/TournamentHeaderPanel'
import { TournamentParticipationPanel } from '../components/TournamentParticipationPanel'
import { TournamentPodPanel } from '../components/TournamentPodPanel'
import { useTournament } from '../hooks/useTournament'
import { isAdmin } from '../hooks/useUsers'
import { request } from '../utils/request'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
)

export function TournamentDetailView() {
  const { id } = useParams()
  const [tournament, setTournament, requestError, isLoading] = useTournament(id)
  const user = useContext(UserContext)
  const classes = useStyles()
  const finishGroupPhase = useCallback(() => {
    if (
      tournament &&
      window.confirm(
        'Are you sure you want to end the group phase for this tournament? This cannot be undone.'
      )
    ) {
      request
        .post(`/api/tournament/${tournament.id}/close-group-stage`)
        .then(() => window.location.reload())
        .catch(() => window.alert('ERROR'))
    }
  }, [tournament])

  if (requestError) {
    return (
      <Container>
        <h5>Error while retrieving tournament: {requestError}</h5>
      </Container>
    )
  } else if (isLoading) {
    return (
      <Container>
        <h5>Loading...</h5>
      </Container>
    )
  } else if (tournament) {
    return (
      <>
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

        {user && isAdmin(user) && tournament.statusId === 'group' && (
          <Fab
            color="primary"
            aria-label="finish group phase"
            variant="extended"
            className={classes.fab}
            onClick={finishGroupPhase}
          >
            <span role="img" aria-label="">
              📆
            </span>
            Finish Group Phase
          </Fab>
        )}
      </>
    )
  } else {
    return <Container>No data found.</Container>
  }
}
