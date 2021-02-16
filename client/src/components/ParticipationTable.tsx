import { Typography, Container } from '@material-ui/core'
import MaterialTable from 'material-table'
import React, { useCallback, useReducer } from 'react'

import { Participant, api } from '../api'
import { RowUser } from '../hooks/useUsers'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { getClanForId } from '../utils/clanUtils'
import { getTimezoneForId, getTimezonePreferenceForId } from '../utils/timezoneUtils'
import { ClanMon } from './ClanMon'
import { DeletionDialog } from './DeletionDialog'
import { MessageSnackBar } from './MessageSnackBar'
import UserAvatar from './UserAvatar'

interface State {
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
  modalOpen: boolean
  dialogOpen: boolean
  deletionId: number
  initialEditState: {
    participationId: number
    userId: string
    clanId: number
    timezoneId: number
    timezonePreferenceId: string
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any) {
  switch (action.type) {
    case 'CLOSE_SNACKBAR':
      return { ...state, snackBarOpen: false }
    case 'OPEN_MODAL': {
      return { ...state, modalOpen: true }
    }
    case 'OPEN_DIALOG': {
      return { ...state, dialogOpen: true }
    }
    case 'SET_EDIT_STATE': {
      const participation: Participant = action.payload as Participant
      return {
        ...state,
        initialEditState: {
          participationId: participation.id,
          userId: participation.userId,
          clanId: participation.clanId,
          timezoneId: participation.timezoneId,
          timezonePreferenceId: participation.timezonePreferenceId,
        },
      }
    }
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false }
    case 'CLOSE_DIALOG':
      return { ...state, dialogOpen: false }
    case 'SET_DELETION_ID':
      return { ...state, deletionId: action.payload }
    case 'SUCCESS':
      return {
        ...state,
        requestError: false,
        snackBarMessage: action.payload,
        snackBarOpen: true,
        modalOpen: false,
        dialogOpen: false,
      }
    case 'FAILURE':
      return {
        ...state,
        snackBarMessage: action.payload,
        requestError: true,
        snackBarOpen: true,
      }
    default:
      throw new Error(action.type)
  }
}

const useDeleteParticipant = (
  tournamentId: number,
  dispatch: React.Dispatch<any>,
  onUpdate: () => void
) =>
  useCallback(
    (participantId: number) => {
      api.Tournament.deleteParticipant({ tournamentId, participantId })
        .then(() => {
          dispatch({ type: 'SUCCESS', payload: 'The participation was deleted successfully!' })
          onUpdate()
        })
        .catch((error) =>
          dispatch({
            type: 'FAILURE',
            payload: 'The participation could not be deleted: ' + error.data,
          })
        )
    },
    [tournamentId, dispatch, onUpdate]
  )

const useUpdateParticipant = (
  tournamentId: number,
  dispatch: React.Dispatch<any>,
  onUpdate: () => void
) =>
  useCallback(
    (
      userId: string,
      clanId: number,
      timezoneId: number,
      timezonePreferenceId: string,
      participantId?: number
    ) => {
      if (participantId == null) {
        return
      }
      api.Tournament.updateParticipant({
        tournamentId,
        participantId,
        body: {
          userId,
          clanId,
          timezoneId,
          timezonePreferenceId,
          id: participantId,
        },
      })
        .then(() => {
          dispatch({ type: 'SUCCESS', payload: 'The participation was updated successfully!' })
          onUpdate()
        })
        .catch((error) =>
          dispatch({
            type: 'FAILURE',
            payload: 'The participation could not be updated: ' + error.data,
          })
        )
    },
    [tournamentId, dispatch, onUpdate]
  )

export function ParticipationTable(props: {
  tournamentId: number
  data: Participant[]
  isEditable?: boolean
  onUpdate: () => void
  title: string
  users: RowUser[]
}) {
  const initialState: State = {
    snackBarOpen: false,
    requestError: false,
    snackBarMessage: '',
    modalOpen: false,
    dialogOpen: false,
    deletionId: 0,
    initialEditState: {
      participationId: 0,
      userId: '',
      clanId: 1,
      timezoneId: 0,
      timezonePreferenceId: 'similar',
    },
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const deleteParticipant = useDeleteParticipant(props.tournamentId, dispatch, props.onUpdate)
  const updateParticipant = useUpdateParticipant(props.tournamentId, dispatch, props.onUpdate)
  const singleParticipant = props.data.length === 1

  return (
    <Container>
      <MaterialTable
        columns={[
          {
            field: 'user',
            title: 'Avatar',
            searchable: false,
            sorting: false,
            render: (rowData: Participant) => (
              <UserAvatar userId={rowData.userId} userAvatar={rowData.discordAvatar} small />
            ),
          },
          {
            field: 'discordName',
            title: 'Discord Name',
            render: (rowData: Participant) => (
              <Typography>
                {rowData.discordName}#{rowData.discordDiscriminator}
              </Typography>
            ),
          },
          {
            field: 'clanId',
            title: 'Clan',
            render: (rowData: Participant) => (
              <div>
                <ClanMon clanId={rowData.clanId} small /> {getClanForId(rowData.clanId)}
              </div>
            ),
          },
          {
            field: 'timezoneId',
            title: 'Timezone',
            render: (rowData: Participant) => (
              <Typography>{getTimezoneForId(rowData.timezoneId)}</Typography>
            ),
          },
          {
            field: 'timezonePreferenceId',
            title: 'Similar Timezone?',
            render: (rowData: Participant) => (
              <Typography>{getTimezonePreferenceForId(rowData.timezonePreferenceId)}</Typography>
            ),
          },
        ]}
        data={props.data}
        title={props.title}
        options={{
          search: !singleParticipant,
          sorting: !singleParticipant,
          paging: !singleParticipant,
          toolbar: !singleParticipant,
          padding: 'dense',
        }}
        actions={
          props.isEditable
            ? [
                {
                  icon: 'edit',
                  tooltip: 'Edit Participation',
                  onClick: (event, rowData) => {
                    dispatch({ type: 'SET_EDIT_STATE', payload: rowData })
                    dispatch({ type: 'OPEN_MODAL' })
                  },
                },
                {
                  icon: 'delete',
                  tooltip: 'Delete Participation',
                  onClick: (event, rowData) => {
                    if (Array.isArray(rowData)) {
                      dispatch({ type: 'SET_DELETION_ID', payload: rowData[0].id })
                    } else {
                      dispatch({ type: 'SET_DELETION_ID', payload: rowData.id })
                    }
                    dispatch({ type: 'OPEN_DIALOG' })
                  },
                },
              ]
            : []
        }
      />
      {state.modalOpen ? (
        <EditParticipationModal
          modalOpen={state.modalOpen}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
          onSubmit={updateParticipant}
          title="Edit Registration"
          users={props.users}
          initialState={state.initialEditState}
        />
      ) : (
        <span />
      )}
      <DeletionDialog
        entity="participation"
        dialogOpen={state.dialogOpen}
        onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}
        handleDeleteAction={() => deleteParticipant(state.deletionId)}
      />
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
    </Container>
  )
}
