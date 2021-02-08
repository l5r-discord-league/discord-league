import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Participant } from '../../api'
import { EmptyState } from '../../components/EmptyState'
import { Loading } from '../../components/Loading'
import { RequestError } from '../../components/RequestError'
import { useTournament } from '../../hooks/useTournament'
import { TournamentDetail } from './TournamentDetail'

export function TournamentDetailView() {
  const params = useParams<{ id: string }>()
  const id = parseInt(params.id, 10)
  const [state, refetch] = useTournament(id)
  const participants = useMemo(
    () =>
      (state.data?.pods ?? []).reduce<Participant[]>(
        (participants, pod) => participants.concat(pod.participants),
        []
      ),
    [state.data]
  )

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
      brackets={state.data.brackets}
      participants={participants}
      pods={state.data.pods}
      tournament={state.data.tournament}
      onTournamentUpdate={refetch}
    />
  )
}
