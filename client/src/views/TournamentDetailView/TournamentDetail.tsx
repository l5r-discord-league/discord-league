import React, { useCallback } from 'react'
import { Container, createStyles, Fab, makeStyles, Paper, Theme } from '@material-ui/core'

import { Tournament$findById, api, Participant } from '../../api'
import { BracketDisplay } from '../../components/BracketDisplay'
import { TournamentAdminPanel } from '../../components/TournamentAdminPanel'
import { TournamentCupClassification } from '../../components/TournamentCupClassification'
import { TournamentHeaderPanel } from '../../components/TournamentHeaderPanel'
import { TournamentParticipationPanel } from '../../components/TournamentParticipationPanel'
import { TournamentPodPanel } from '../../components/TournamentPodPanel'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import { request } from '../../utils/request'

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

const useFinishBracketPhase = (tournamentId: number) =>
  useCallback(() => {
    if (window.confirm('Are you sure you want to finish this tournament? This cannot be undone.')) {
      api.Tournament.closeBracketStage({ tournamentId })
        .then(() => window.location.reload())
        .catch(() => window.alert('ERROR'))
    }
  }, [tournamentId])

export function TournamentDetail({
  tournament,
  pods,
  brackets,
  participants,
  onTournamentUpdate,
}: {
  tournament: Tournament$findById['tournament']
  pods: Tournament$findById['pods']
  brackets: Tournament$findById['brackets']
  participants: Participant[]
  onTournamentUpdate: () => void
}) {
  const classes = useStyles()
  const isAdmin = useIsAdmin()
  const finishGroupPhase = useFinishGroupPhase(tournament.id)
  const startBracketPhase = useStartBracketPhase(tournament.id)
  const finishBracketPhase = useFinishBracketPhase(tournament.id)

  return (
    <>
      <Container>
        <Paper>
          <TournamentHeaderPanel tournament={tournament} />
          {(tournament.statusId === 'bracket' || tournament.statusId === 'finished') &&
            brackets.map((bracket) => <BracketDisplay bracket={bracket} key={bracket.id} />)}
          {tournament.statusId !== 'upcoming' && tournament.statusId !== 'group' && (
            <TournamentCupClassification tournamentId={tournament.id} participants={participants} />
          )}
          {tournament.statusId !== 'upcoming' && pods && <TournamentPodPanel pods={pods} />}
          <TournamentAdminPanel tournament={tournament} onTournamentUpdate={onTournamentUpdate} />
          <TournamentParticipationPanel
            tournament={tournament}
            participants={participants}
            setParticipants={onTournamentUpdate}
          />
        </Paper>
      </Container>

      {isAdmin &&
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
        ) : tournament.statusId === 'bracket' ? (
          <Fab
            color="primary"
            aria-label="Finish the tournament"
            variant="extended"
            className={classes.fab}
            onClick={finishBracketPhase}
          >
            <span role="img" aria-label="">
              ✅
            </span>
            Finish the tournament
          </Fab>
        ) : null)}
    </>
  )
}
