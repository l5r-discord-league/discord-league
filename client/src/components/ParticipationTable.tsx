import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import MaterialTable from 'material-table'
import React, { useReducer } from 'react'
import UserAvatar from './UserAvatar'
import {
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core'
import { ClanMon } from './ClanMon'
import { getClanForId } from '../utils/clanUtils'
import { getTimezoneForId, getTimezonePreferenceForId } from '../utils/timezoneUtils'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { MessageSnackBar } from './MessageSnackBar'
import { request } from '../utils/request'
import { isAdmin } from '../hooks/useUsers'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { DeletionDialog } from './DeletionDialog'

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
      const participation: ParticipantWithUserData = action.payload as ParticipantWithUserData
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

export function ParticipationTable(props: {
  tournamentId: number
  data: ParticipantWithUserData[]
  singleParticipantView?: boolean
  updateParticipants: React.Dispatch<React.SetStateAction<ParticipantWithUserData[]>>
  title: string
}) {
  const user = useCurrentUser()
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

  function deleteParticipant(participantId: number) {
    request
      .delete('/api/tournament/' + props.tournamentId + '/participant/' + participantId)
      .then(() => {
        dispatch({ type: 'SUCCESS', payload: 'The participation was deleted successfully!' })
        props.updateParticipants(props.data.filter(participant => participantId !== participant.id))
      })
      .catch(error =>
        dispatch({
          type: 'FAILURE',
          payload: 'The participation could not be deleted: ' + error.data,
        })
      )
  }

  function updateParticipant(
    userId: string,
    clanId: number,
    timezoneId: number,
    timezonePreferenceId: string,
    participantId?: number
  ) {
    if (!participantId) {
      return
    }
    request
      .put('/api/tournament/' + props.tournamentId + '/participant/' + participantId, {
        userId: userId,
        clanId: clanId,
        timezoneId: timezoneId,
        timezonePreferenceId: timezonePreferenceId,
        id: participantId,
      })
      .then(resp => {
        dispatch({ type: 'SUCCESS', payload: 'The participation was updated successfully!' })
        props.updateParticipants(
          props.data.map(participant => {
            if (participantId !== participant.id) {
              return participant
            } else {
              return resp.data
            }
          })
        )
      })
  }

  return (
    <Container>
      <Typography>{props.title}</Typography>
      <MaterialTable
        columns={[
          {
            field: 'user',
            title: 'Avatar',
            searchable: false,
            sorting: false,
            render: (rowData: ParticipantWithUserData) => (
              <UserAvatar userId={rowData.userId} userAvatar={rowData.discordAvatar} small />
            ),
          },
          {
            field: 'discordName',
            title: 'Discord Name',
            render: (rowData: ParticipantWithUserData) => (
              <Typography>
                {rowData.discordName}#{rowData.discordDiscriminator}
              </Typography>
            ),
          },
          {
            field: 'clanId',
            title: 'Clan',
            render: (rowData: ParticipantWithUserData) => (
              <div>
                <ClanMon clanId={rowData.clanId} small /> {getClanForId(rowData.clanId)}
              </div>
            ),
          },
          {
            field: 'timezoneId',
            title: 'Timezone',
            render: (rowData: ParticipantWithUserData) => (
              <Typography>{getTimezoneForId(rowData.timezoneId)}</Typography>
            ),
          },
          {
            field: 'timezonePreferenceId',
            title: 'Similar Timezone?',
            render: (rowData: ParticipantWithUserData) => (
              <Typography>{getTimezonePreferenceForId(rowData.timezonePreferenceId)}</Typography>
            ),
          },
        ]}
        data={props.data}
        title={props.title}
        options={{
          search: !props.singleParticipantView,
          sorting: !props.singleParticipantView,
          paging: !props.singleParticipantView,
          toolbar: !props.singleParticipantView,
          padding: 'dense',
        }}
        actions={
          props.singleParticipantView || (user && isAdmin(user))
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
