import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'
import { NavBar } from './components/NavBar'
import { MyMatchesView } from './views/MyMatchesView'
import { TournamentView } from './views/TournamentView'
import { UserView } from './views/UserView'
import { useCurrentUser } from './hooks/useCurrentUser'
import { User } from './hooks/useUsers'
import { UserProfile } from './views/UserProfile'
import { TournamentDetailView } from './views/TournamentDetailView'
import { PodDetailView } from './views/PodDetailView'

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
export const UserContext = React.createContext<User | undefined>(undefined)

export default function App(): JSX.Element {
  const user = useCurrentUser()

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={user}>
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
