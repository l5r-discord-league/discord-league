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

type ApiCall = (params?: Parameters) => Promise<Response>
type HookResult<Data> = [State<Data>, () => void]

export function createMapersmithHook<Data>(apiCall: ApiCall): () => HookResult<Data>
export function createMapersmithHook<Data, Id>(
  apiCall: ApiCall,
  pm: (resourceId: Id) => Parameters | undefined
): (resourceId: Id) => HookResult<Data>
export function createMapersmithHook<Data, Id>(
  apiCall: ApiCall,
  pm?: (resourceId: Id) => Parameters | undefined
) {
  const initialState: State<Data> = { loading: false }

  function reducer(state: State<Data>, action: Action<Data>): State<Data> {
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

  return function (resourceId: Id): [State<Data>, () => void] {
    const [state, dispatch] = useReducer(reducer, initialState)

    const fetchData = useCallback(() => {
      dispatch({ type: 'startRequest' })
      apiCall(pm ? pm(resourceId) : undefined)
        .then((response) => dispatch({ type: 'success', payload: response.data<Data>() }))
        .catch((response) => dispatch({ type: 'error', error: response.error() }))
    }, [resourceId])

    useEffect(() => fetchData(), [fetchData])

    return [state, fetchData]
  }
}
