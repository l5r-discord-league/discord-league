import { useTournaments } from '../../hooks/useTournaments'
import { RequestError } from '../../components/RequestError'
import { Loading } from '../../components/Loading'
import { EmptyState } from '../../components/EmptyState'
import { TournamentIndex } from './TournamentIndex'

export function TournamentView() {
  const [tournaments, refetchTournaments] = useTournaments()

  if (typeof tournaments.error === 'string') {
    return <RequestError requestError={tournaments.error} />
  }
  if (tournaments.loading) {
    return <Loading />
  }
  if (tournaments.data == null) {
    return <EmptyState />
  }

  return (
    <TournamentIndex
      tournaments={tournaments.data}
      onCreateTournamentSuccess={refetchTournaments}
    />
  )
}
