import { User$findCurrent } from '@dl/api'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { createContext } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { NavBar } from './components/NavBar'
import { useCurrentUser } from './hooks/useCurrentUser'
import { captureToken } from './utils/auth'
import { MyMatchesView } from './views/MyMatchesView/MyMatchesView'
import { TournamentView } from './views/TournamentView/TournamentView'
import { UserView } from './views/UserView'
import { UserProfile } from './views/UserProfile'
import { TournamentDetailView } from './views/TournamentDetailView/TournamentDetailView'
import { PodDetailView } from './views/PodDetailView/PodDetailView'

// create our material ui theme using up to date typography variables
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00695c',
    },
    secondary: {
      main: '#ffab91',
    },
  },
})

export const UserContext = createContext<User$findCurrent['response'] | undefined>(undefined)

export default function App(): JSX.Element {
  captureToken()
  const [user] = useCurrentUser()

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={user.data}>
        <BrowserRouter>
          <NavBar />
          <br />
          <Switch>
            <Route path="/tournaments">
              <TournamentView />
            </Route>
            <Route path="/tournament/:id">
              <TournamentDetailView />
            </Route>
            <Route path="/pod/:id">
              <PodDetailView />
            </Route>
            <Route path="/my-matches">
              <MyMatchesView />
            </Route>
            <Route path="/users">
              <UserView />
            </Route>
            <Route path="/user/:id">
              <UserProfile />
            </Route>
            <Redirect from="/" exact to="/tournaments" />
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  )
}
