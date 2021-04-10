import forge, { Middleware } from 'mappersmith'
import EncodeJson from 'mappersmith/middleware/encode-json'
import GlobalErrorHandler, { setErrorHandler } from 'mappersmith/middleware/global-error-handler'
import { getToken, unsetToken } from './utils/auth'

setErrorHandler((response) => {
  if (response.status() === 401) {
    unsetToken()
  }
  return false
})

const BearerToken: Middleware = () => ({
  prepareRequest(next) {
    return next().then((request) => {
      const bearerToken = getToken()
      return bearerToken == null
        ? request
        : request.enhance({ headers: { Authorization: `Bearer ${bearerToken}` } })
    })
  },
})

export const api = forge({
  clientId: 'dl-client',
  middleware: [BearerToken, EncodeJson, GlobalErrorHandler],
  host: '/api',
  resources: {
    Decklist: {
      createForParticipant: { method: 'POST', path: '/participant/{participantId}/decklist' },
      updateForParticipant: { method: 'PUT', path: '/participant/{participantId}/decklist' },
      findAllForTournament: { method: 'GET', path: '/tournament/{tournamentId}/decklists' },
    },
    Participant: {
      drop: { method: 'POST', path: '/participant/{participantId}/drop' },
    },
    Pod: {
      findById: { method: 'GET', path: '/pod/{podId}' },
      createParticipant: { method: 'POST', path: '/pod/{podId}/participant' },
    },
    Match: {
      updateReport: { method: 'PUT', path: '/match/{matchId}/report' },
      deleteReport: { method: 'DELETE', path: '/match/{matchId}/report' },
    },
    Tournament: {
      findAll: { method: 'GET', path: '/tournament' },
      create: { method: 'POST', path: '/tournament' },
      findById: { method: 'GET', path: '/tournament/{tournamentId}' },
      findStatistics: { method: 'GET', path: '/tournament/{tournamentId}/statistics' },
      updateById: { method: 'PUT', path: '/tournament/{tournamentId}' },
      deleteById: { method: 'DELETE', path: '/tournament/{tournamentId}' },
      createParticipant: { method: 'POST', path: '/tournament/{tournamentId}/participant' },
      updateParticipant: {
        method: 'PUT',
        path: '/tournament/{tournamentId}/participant/{participantId}',
      },
      deleteParticipant: {
        method: 'DELETE',
        path: '/tournament/{tournamentId}/participant/{participantId}',
      },
      closeGroupStage: { method: 'POST', path: '/tournament/{tournamentId}/close-group-stage' },
      startBracketStage: { method: 'POST', path: '/tournament/{tournamentId}/start-bracket-stage' },
      closeBracketStage: { method: 'POST', path: '/tournament/{tournamentId}/close-bracket-stage' },
      startGroupStage: { method: 'POST', path: '/tournament/{tournamentId}/start-group-stage' },
    },
    User: {
      findAll: { method: 'GET', path: '/user' },
      getCurrent: { method: 'GET', path: '/user/current' },
      findById: { method: 'GET', path: '/user/{userId}' },
      patchById: { method: 'PATCH', path: '/user/{userId}' },
      findMatches: { method: 'GET', path: '/user/{userId}/matches' },
    },
  },
})
