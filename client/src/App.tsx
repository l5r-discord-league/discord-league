import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import 'bootstrap/dist/css/bootstrap.min.css'

import './App.css'
import { NavBar } from './components/NavBar'
import { setToken } from './utils/request'
import { GameView } from './views/GameView'
import { TournamentView } from './views/TournamentView'
import { UserView } from './views/UserView'

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

const bearerToken = {
  tokenFromQueryParamsRegexp: /token=(.*)/,
  extractToken(): string | undefined {
    const match = document.location.search.match(/token=(.*)/)
    return match ? match[1] : undefined
  },
}

export default function App(): JSX.Element {
  const token = bearerToken.extractToken()
  if (token) {
    setToken(token)
  }
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route path="/tournaments">
            <TournamentView />
          </Route>
          <Route path="/my-games">
            <GameView />
          </Route>
          <Route path="/users">
            <UserView />
          </Route>
          <Redirect from="/" exact to="/tournaments" />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  )
}
