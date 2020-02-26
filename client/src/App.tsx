import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { TournamentView } from './views/TournamentView'
import { GameView } from './views/GameView'
import { UserView } from './views/UserView'
import { NavBar } from './components/NavBar'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

// create our material ui theme using up to date typography variables
const theme = createMuiTheme({})

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="App">
        <ThemeProvider theme={theme}>
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
          </Switch>
        </ThemeProvider>
      </div>
    </BrowserRouter>
  )
}
