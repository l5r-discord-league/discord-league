import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { TournamentView } from './views/TournamentView'
import { GameView } from './views/GameView'
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
          <NavBar userId="123" userName="TestTestTest#1234" userAvatarHash="12312" />
          <Switch>
            <Route path="/tournaments">
              <TournamentView />
            </Route>
            <Route path="/my-games">
              <GameView />
            </Route>
          </Switch>
        </ThemeProvider>
      </div>
    </BrowserRouter>
  )
}
