import { Parameters, Response } from 'mappersmith'
import { useCallback, useEffect, useReducer } from 'react'

interface State<D> {
  loading: boolean
  error?: string
  data?: D
}

type Action<D> =
  | { type: 'startRequest' }
  | { type: 'success'; payload: D }
  | { type: 'error'; error: string }

type MappersmithFunction = (params?: Parameters) => Promise<Response>
type ParameterFactory<I> = (resourceId: I) => Parameters | undefined

export function createMapersmithHook<D, I = undefined>(
  apiCall: MappersmithFunction,
  pm: ParameterFactory<I> = () => undefined
) {
  const initialState: State<D> = { loading: false }

  function reducer(state: State<D>, action: Action<D>): State<D> {
    switch (action.type) {
      case 'startRequest':
        return { ...state, loading: true, error: undefined }
      case 'success':
        return {
          loading: false,
          data: action.payload,
        }
      case 'error':
        return { loading: false, error: action.error }
    }
  }

  return function (resourceId: I): [State<D>, () => void] {
    const [state, dispatch] = useReducer(reducer, initialState)

    const fetchData = useCallback(() => {
      dispatch({ type: 'startRequest' })
      apiCall(pm(resourceId))
        .then((response) => dispatch({ type: 'success', payload: response.data<D>() }))
        .catch((response) => dispatch({ type: 'error', error: response.error() }))
    }, [resourceId])

    useEffect(() => fetchData(), [fetchData])

    return [state, fetchData]
  }
}
