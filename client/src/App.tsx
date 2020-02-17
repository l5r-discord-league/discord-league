import React from 'react'
import './App.css'
import { TournamentView } from './views/TournamentView'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App(): JSX.Element {
  return (
    <div className="App">
      <TournamentView />
    </div>
  )
}
