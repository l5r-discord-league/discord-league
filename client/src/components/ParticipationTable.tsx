import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'
import MaterialTable from 'material-table'
import React, { useReducer } from 'react'
import UserAvatar from './UserAvatar'
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core'
import { ClanMon } from '../utils/ClanMon'
import { getClanForId } from '../utils/clanUtils'
import { getTimezoneForId, getTimezonePreferenceForId } from '../utils/timezoneUtils'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { MessageSnackBar } from './MessageSnackBar'
import { request } from '../utils/request'
import { isAdmin } from '../hooks/useUsers'
import { useCurrentUser } from '../hooks/useCurrentUser'

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
      console.log(participation)
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
  singleParticipant?: boolean
  isParticipating?: boolean
  title: string
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
      clanId: 0,
      timezoneId: 0,
      timezonePreferenceId: 'similar',
    },
  }

  const user = useCurrentUser()
  const [state, dispatch] = useReducer(reducer, initialState)

  function deleteParticipant(participantId: number) {
    request
      .delete('/api/tournament/' + props.tournamentId + '/participant/' + participantId)
      .then(() => {
        dispatch({ type: 'SUCCESS', payload: 'The participation was deleted successfully!' })
        window.location.reload()
      })
      .catch(() =>
        dispatch({ type: 'FAILURE', payload: 'The participation could not be deleted ' })
      )
  }

  function updateParticipant(
    userId: string,
    clanId: number,
    timezoneId: number,
    timezonePreferenceId: string,
    participationId?: number
  ) {
    console.log(participationId)
    if (!participationId) {
      return
    }
    request
      .put('/api/tournament/' + props.tournamentId + '/participant/' + participationId, {
        userId: userId,
        clanId: clanId,
        timezoneId: timezoneId,
        timezonePreferenceId: timezonePreferenceId,
        id: participationId,
      })
      .then(() => {
        dispatch({ type: 'SUCCESS', payload: 'The participation was updated successfully!' })
        window.location.reload()
      })
  }

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={props.title.toLowerCase + '-tournaments-content'}
        id={props.title.toLowerCase + '-tournaments-header'}
      >
        <Typography>{props.title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Container>
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
                field: 'userData.discordName',
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
                  <Typography>
                    {getTimezonePreferenceForId(rowData.timezonePreferenceId)}
                  </Typography>
                ),
              },
            ]}
            data={props.data}
            title={props.title}
            options={{
              search: !props.singleParticipant,
              sorting: !props.singleParticipant,
              paging: !props.singleParticipant,
              toolbar: !props.singleParticipant,
            }}
            actions={
              props.singleParticipant || (user && isAdmin(user))
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
        </Container>
      </ExpansionPanelDetails>
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
      <Dialog
        open={state.dialogOpen}
        onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Do you really want to delete this participation?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" color="error">
            This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => dispatch({ type: 'CLOSE_DIALOG' })}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteParticipant(state.deletionId)}
            color="primary"
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <MessageSnackBar
        open={state.snackBarOpen}
        onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })}
        error={state.requestError}
        message={state.snackBarMessage}
      />
    </ExpansionPanel>
  )
}
