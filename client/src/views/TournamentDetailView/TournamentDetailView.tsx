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

  if (typeof state.error === 'string') {
    return <RequestError requestError={state.error} />
  }
  if (state.loading) {
    return <Loading />
  }
  if (state.data == null) {
    return <EmptyState />
  }
  return (
    <TournamentDetail
      tournament={state.data.tournament}
      pods={state.data.pods}
      brackets={state.data.brackets}
      onTournamentUpdate={refetch}
    />
  )
}
