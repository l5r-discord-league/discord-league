import React, { useReducer } from 'react'
import { Container, Typography, Divider, Button } from '@material-ui/core'
import MaterialTable from 'material-table'
import { Tournament } from '../hooks/useTournaments'
import {
  useTournamentParticipants,
  ParticipantWithUserData,
} from '../hooks/useTournamentParticipants'
import UserAvatar from './UserAvatar'
import { ClanMon } from '../utils/ClanMon'
import { getClanForId } from '../utils/clanUtils'
import { EditParticipationModal } from '../modals/EditParticipationModal'
import { MessageSnackBar } from './MessageSnackBar'
import { request } from '../utils/request'

interface State {
  snackBarOpen: boolean
  requestError: boolean
  snackBarMessage: string
  modalOpen: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: State, action: any) {
  switch (action.type) {
    case 'CLOSE_SNACKBAR':
      return { ...state, snackBarOpen: false }
    case 'OPEN_MODAL':
      return { ...state, modalOpen: true }
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false }
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

export function TournamentParticipationPanel(props: { tournament: Tournament }) {
  const initialState: State = {
    snackBarOpen: false,
    requestError: false,
    snackBarMessage: '',
    modalOpen: false,
  }

  const participants = useTournamentParticipants(props.tournament.id)
  const [state, dispatch] = useReducer(reducer, initialState)

  function createParticipation(
    userId: string,
    clanId: number,
    timezoneId: number,
    timezonePreferenceId: string
  ) {
    request
      .post('/api/tournament/' + props.tournament.id + '/participant', {
        userId: userId,
        clanId: clanId,
        timezoneId: timezoneId,
        timezonePreferenceId: timezonePreferenceId,
      })
      .then(resp => {
        dispatch({ type: 'SUCCESS', payload: "You've successfully registered for the tournament" })
        participants.push(resp.data)
      })
      .catch(() => {
        dispatch({ type: 'FAILURE', payload: 'An error occurred during tournament registration.' })
      })
  }
  return (
    <Container>
      <Divider />
      <Typography variant="h6" align="center">
        Participants
      </Typography>
      <Container>
        <MaterialTable
          columns={[
            {
              field: 'user',
              title: 'Avatar',
              searchable: false,
              sorting: false,
              render: (rowData: ParticipantWithUserData) => (
                <UserAvatar user={rowData.userData.user} small />
              ),
            },
            {
              field: 'userData.discordName',
              title: 'Discord Name',
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
          ]}
          data={participants}
          title="Participants"
          options={{
            search: true,
            paging: false,
            sorting: true,
          }}
        />
      </Container>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => dispatch({ type: 'OPEN_MODAL' })}
      >
        Register
      </Button>
      <EditParticipationModal
        modalOpen={state.modalOpen}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
        onSubmit={createParticipation}
        title={'Register for ' + props.tournament.name}
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
