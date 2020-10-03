import { useEffect, useReducer } from 'react'
import { request } from '../utils/request'

export interface Decklist {
  bracket: 'silverCup' | 'goldCup' | null
  clanId: number
  decklist: string
  discordAvatar: string
  discordDiscriminator: string
  discordId: string
  discordName: string
  link: string
  locked: boolean
  participantId: number
}

interface State {
  isLoading: boolean
  data?: Decklist[]
  error?: string
}

type Action =
  | { type: 'startFetching' }
  | { type: 'endFetching'; payload: Decklist[] }
  | { type: 'error'; message: string }

const initialState = { isLoading: false }
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'startFetching':
      return { isLoading: true, data: state.data }
    case 'endFetching':
      return { isLoading: false, data: action.payload }
    case 'error':
      return { isLoading: false, error: action.message }
  }
}

export function useTournamentDecklists(tournamentId: number): [State] {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    dispatch({ type: 'startFetching' })
    request
      .get('/api/tournament/' + tournamentId + '/decklists')
      .then(resp => dispatch({ type: 'endFetching', payload: resp.data }))
      .catch(error => dispatch({ type: 'error', message: error }))
  }, [tournamentId])

  return [state]
}
