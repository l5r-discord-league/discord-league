import { useContext } from 'react'
import Typography from '@material-ui/core/Typography'

import { UserContext } from '../../App'
import { MyMatchesLoader } from './MyMatchesLoader'

export function MyMatchesView(): JSX.Element {
  const user = useContext(UserContext)
  if (!user) {
    return (
      <Typography variant="h6" align="center">
        You need to be logged in to see your games.
      </Typography>
    )
  }

  return <MyMatchesLoader user={user} />
}
