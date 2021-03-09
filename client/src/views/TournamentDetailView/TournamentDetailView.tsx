import { useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '../../components/EmptyState'
import { Loading } from '../../components/Loading'
import { RequestError } from '../../components/RequestError'
import { useTournament } from '../../hooks/useTournament'
import { useUsers } from '../../hooks/useUsers'
import { TournamentDetail } from './TournamentDetail'

export function TournamentDetailView() {
  const params = useParams<{ id: string }>()
  const id = parseInt(params.id, 10)
  const [tournament, refetchTournament] = useTournament(id)
  const [users, refetchUsers] = useUsers()
  const refetchData = useCallback(() => {
    refetchTournament()
    refetchUsers()
  }, [refetchTournament, refetchUsers])

  if (typeof tournament.error === 'string') {
    return <RequestError requestError={tournament.error} />
  }
  if (typeof users.error === 'string') {
    return <RequestError requestError={users.error} />
  }
  if (tournament.loading || users.loading) {
    return <Loading />
  }
  if (tournament.data == null || users.data == null) {
    return <EmptyState />
  }

  return (
    <TournamentDetail
      brackets={tournament.data.brackets}
      participants={tournament.data.participants}
      pods={tournament.data.pods}
      tournament={tournament.data.tournament}
      users={users.data}
      onTournamentUpdate={refetchData}
    />
  )
}
