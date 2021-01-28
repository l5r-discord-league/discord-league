import { useCallback, useEffect, useReducer } from 'react'
import { api, Tournament$findById } from '../api'

type State = {
  loading: boolean
  error?: string
  tournament?: Tournament$findById['tournament']
  pods?: Tournament$findById['pods']
}
type Action =
  | { type: 'startRequest' }
  | { type: 'success'; payload: Tournament$findById }
  | { type: 'error'; error: string }

const initialState: State = { loading: false }
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'startRequest':
      return { ...state, loading: true, error: undefined }
    case 'success':
      return { loading: false, tournament: action.payload.tournament, pods: action.payload.pods }
    case 'error':
      return { loading: false, error: action.error }
  }
}

export function useTournament(tournamentId: string): [State, () => void] {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchData = useCallback(() => {
    dispatch({ type: 'startRequest' })
    api.Tournament.findById({ tournamentId })
      .then((response) =>
        dispatch({
          type: 'success',
          payload: response.data<Tournament$findById>(),
        })
      )
      .catch((response) => dispatch({ type: 'error', error: response.error() }))
  }, [tournamentId])

  useEffect(() => fetchData(), [fetchData])

  return [state, fetchData]
}
