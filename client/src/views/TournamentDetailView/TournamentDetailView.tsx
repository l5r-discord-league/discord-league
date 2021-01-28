import React from 'react'
import { useParams } from 'react-router-dom'

import { useTournament } from '../../hooks/useTournament'

import { EmptyState } from './EmptyState'
import { Loading } from './Loading'
import { RequestError } from './RequestError'
import { TournamentDetail } from './TournamentDetail'

export function TournamentDetailView() {
  const { id } = useParams<{ id: string }>()
  const [state, refetch] = useTournament(id)

  if (state.error) {
    return <RequestError requestError={state.error} />
  }
  if (state.loading) {
    return <Loading />
  }
  if (!state.tournament) {
    return <EmptyState />
  }
  return (
    <TournamentDetail
      tournament={state.tournament}
      pods={state.pods}
      brackets={state.brackets}
      onTournamentUpdate={refetch}
    />
  )
}
