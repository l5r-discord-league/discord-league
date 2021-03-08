import { useReducer } from 'react'
import { useParams } from 'react-router-dom'

import { api } from '../../api'
import { EmptyState } from '../../components/EmptyState'
import { Loading } from '../../components/Loading'
import { RequestError } from '../../components/RequestError'
import { ParticipantWithUserData } from '../../hooks/useTournamentParticipants'
import { useTournamentPod } from '../../hooks/useTournamentPod'
import { useUsers } from '../../hooks/useUsers'
import { ConfirmParticipantDrop } from '../../modals/ConfirmParticipantDrop'
import { PodDetail } from './PodDetail'

interface State {
  isDropConfirmationOpen: boolean
  participantBeingDroped?: {
    userId: string
    discordName: string
    discordDiscriminator: string
    id: number
  }
  error?: string
}
type Action =
  | { type: 'confirmDrop'; payload: ParticipantWithUserData }
  | { type: 'dropError'; payload: string }
  | { type: 'closeConfirmation' }

const initialState: State = { isDropConfirmationOpen: false }
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'confirmDrop':
      return {
        isDropConfirmationOpen: true,
        participantBeingDroped: action.payload,
      }
    case 'closeConfirmation':
      return { isDropConfirmationOpen: false }
    case 'dropError':
      return { isDropConfirmationOpen: false, error: action.payload }
    default:
      return state
  }
}

export function PodDetailView() {
  const { id } = useParams<{ id: string }>()
  const users = useUsers()
  const [podState, refetchPod] = useTournamentPod(id)
  const [state, dispatch] = useReducer(reducer, initialState)

  if (typeof state.error === 'string') {
    return <RequestError requestError={state.error} />
  }
  if (typeof podState.error === 'string') {
    return <RequestError requestError={podState.error} />
  }
  if (podState.loading) {
    return <Loading />
  }
  if (podState.data == null) {
    return <EmptyState />
  }

  return (
    <>
      <PodDetail
        pod={podState.data}
        users={users}
        onDrop={(participant: any) => {
          dispatch({ type: 'confirmDrop', payload: participant })
        }}
      />

      {state.isDropConfirmationOpen && state.participantBeingDroped && (
        <ConfirmParticipantDrop
          participant={state.participantBeingDroped}
          onCancel={() => dispatch({ type: 'closeConfirmation' })}
          onConfirm={async () => {
            const participantId = state.participantBeingDroped?.id
            if (participantId == null) {
              return dispatch({ type: 'dropError', payload: 'Error!' }) // If this fired the state somehow got broken
            }

            try {
              await api.Participant.drop({ participantId })
            } catch (error) {
              dispatch({ type: 'dropError', payload: error })
            } finally {
              dispatch({ type: 'closeConfirmation' })
              refetchPod()
            }
          }}
        />
      )}
    </>
  )
}
