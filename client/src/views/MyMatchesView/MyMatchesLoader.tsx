import { User$findCurrent } from '@dl/api'

import { useMatchesForUser } from '../../hooks/useMatchesForUser'
import { Loading } from '../../components/Loading'
import { RequestError } from '../../components/RequestError'
import { EmptyState } from '../../components/EmptyState'
import { MyMatches } from './MyMatches'

export function MyMatchesLoader(props: { user: User$findCurrent['response'] }): JSX.Element {
  const [state] = useMatchesForUser(props.user.discordId)

  if (state.loading) {
    return <Loading />
  }

  if (state.error) {
    return <RequestError requestError={state.error} />
  }

  if (!state.data) {
    return <EmptyState />
  }

  return <MyMatches user={props.user} tournamentsWithMatches={state.data} />
}
