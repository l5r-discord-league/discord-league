import React from 'react'
import { useParams } from 'react-router-dom'

import { useTournament } from '../../hooks/useTournament'

import { EmptyState } from './EmptyState'
import { Loading } from './Loading'
import { RequestError } from './RequestError'
import { TournamentDetail } from './TournamentDetail'

export function TournamentDetailView() {
  const { id } = useParams<{ id: string }>()
  const [tournament, setTournament, pods, requestError, isLoading] = useTournament(id)

  if (requestError) {
    return <RequestError requestError={requestError} />
  }
  if (isLoading) {
    return <Loading />
  }
  if (!tournament) {
    return <EmptyState />
  }
  return <TournamentDetail tournament={tournament} pods={pods} onTournamentUpdate={setTournament} />
}
