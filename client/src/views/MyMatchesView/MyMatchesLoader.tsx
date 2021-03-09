import { User } from '@dl/api'
import { Container } from '@material-ui/core'

import { useMatchesForUser } from '../../hooks/useMatchesForUser'
import { Loading } from '../../components/Loading'
import { RequestError } from '../../components/RequestError'
import { EmptyState } from '../../components/EmptyState'
import { MyMatches } from './MyMatches'

export function MyMatchesLoader(props: { user: User }): JSX.Element {
  const [matches, refetchMatches] = useMatchesForUser(props.user.discordId)

  if (matches.loading) {
    return <Loading />
  }

  if (matches.error) {
    return <RequestError requestError={matches.error} />
  }

  if (!matches.data) {
    return <EmptyState />
  }

  return (
    <Container>
      {matches.data.map(({ tournament, participants, matches }) => (
        <MyMatches
          tournament={tournament}
          matches={matches}
          participants={participants}
          onUpdate={refetchMatches}
          key={tournament.id}
        />
      ))}
    </Container>
  )
}
