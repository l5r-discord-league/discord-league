import React, { useCallback, useContext } from 'react'

import {
  Typography,
  Container,
  createStyles,
  Fab,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core'

import { UserContext } from '../../App'
import { TournamentAdminPanel } from '../../components/TournamentAdminPanel'
import { TournamentHeaderPanel } from '../../components/TournamentHeaderPanel'
import { TournamentParticipationPanel } from '../../components/TournamentParticipationPanel'
import { TournamentPodPanel } from '../../components/TournamentPodPanel'
import { TournamentCupClassification } from '../../components/TournamentCupClassification'
import { isAdmin } from '../../hooks/useUsers'
import { request } from '../../utils/request'
import { Tournament } from '../../hooks/useTournaments'
import { useTournamentParticipants } from '../../hooks/useTournamentParticipants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
)

const useFinishGroupPhase = (tournamentId: number) =>
  useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to end the group phase for this tournament? This cannot be undone.'
      )
    ) {
      request
        .post(`/api/tournament/${tournamentId}/close-group-stage`)
        .then(() => window.location.reload())
        .catch(() => window.alert('ERROR'))
    }
  }, [tournamentId])

const useStartBracketPhase = (tournamentId: number) =>
  useCallback(() => {
    if (
      window.confirm('Are you sure you want to lock the decklists and start the bracket phase?')
    ) {
      request
        .post(`/api/tournament/${tournamentId}/start-bracket-stage`)
        .then(() => window.location.reload())
        .catch(() => window.alert('ERROR'))
    }
  }, [tournamentId])

const Loading = () => (
  <Container>
    <Typography variant="h6" align="center">
      Loading...
    </Typography>
  </Container>
)

const Error = ({ error }: { error: string }) => (
  <Container>
    <Typography variant="h6" align="center">
      Error while retrieving data: {error}
    </Typography>
  </Container>
)
export function TournamentDetail({
  tournament,
  onTournamentUpdate,
}: {
  tournament: Tournament
  onTournamentUpdate: (tournamentData: Tournament) => void
}) {
  const user = useContext(UserContext)
  const classes = useStyles()
  const finishGroupPhase = useFinishGroupPhase(tournament.id)
  const startBracketPhase = useStartBracketPhase(tournament.id)
  const [participants, setParticipants, isLoading, error] = useTournamentParticipants(tournament.id)

  return (
    <>
      <Container>
        <Paper>
          <TournamentHeaderPanel tournament={tournament} />
          {tournament.statusId !== 'upcoming' && tournament.statusId !== 'group' && (
            <TournamentCupClassification tournamentId={tournament.id} participants={participants} />
          )}
          {tournament.statusId !== 'upcoming' && (
            <TournamentPodPanel tournamentId={tournament.id} />
          )}
          <TournamentAdminPanel tournament={tournament} onTournamentUpdate={onTournamentUpdate} />
          {isLoading ? (
            <Loading />
          ) : error ? (
            <Error error={error} />
          ) : (
            <TournamentParticipationPanel
              tournament={tournament}
              participants={participants}
              setParticipants={setParticipants}
            />
          )}
        </Paper>
      </Container>

      {user &&
        isAdmin(user) &&
        (tournament.statusId === 'group' ? (
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
        ) : tournament.statusId === 'endOfGroup' ? (
          <Fab
            color="primary"
            aria-label="Lock decks and start bracket phase"
            variant="extended"
            className={classes.fab}
            onClick={startBracketPhase}
          >
            <span role="img" aria-label="">
              ⚔️
            </span>
            Lock decks & Start bracket phase
          </Fab>
        ) : null)}
    </>
  )
}
