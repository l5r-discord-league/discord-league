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
  resources: {
    Tournament: {
      findAll: { method: 'GET', path: '/api/tournament' },
      create: { method: 'POST', path: '/api/tournament' },
      findById: { method: 'GET', path: '/api/tournament/{tournamentId}' },
      closeBracketStage: {
        method: 'POST',
        path: '/api/tournament/{tournamentId}/close-bracket-stage',
      },
    },
  },
})

export interface Tournament {
  id: number
  name: string
  startDate: string
  statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
  typeId: 'monthly' | 'pod6'
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Tournament$findAll {
  upcoming: Tournament[]
  ongoing: Tournament[]
  past: Tournament[]
}

export interface Participant {
  id: number
  userId: string
  clanId: number
  dropped: boolean
  discordAvatar: string
  discordDiscriminator: string
  discordId: string
  discordName: string
  timezoneId: number
  bracket: 'silverCup' | 'goldCup' | null
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  wins: number
  losses: number
  position: number
}

export interface Tournament$findById {
  tournament: Tournament
  pods: Array<{
    id: number
    name: string
    tournamentId: number
    timezoneId: number
    matches: Array<{
      id: number
      createdAt: Date
      updatedAt: Date
      playerAId: number
      playerBId: number
      winnerId?: number
      firstPlayerId?: number
      victoryConditionId?: number
      deckAClanId?: number
      deckARoleId?: number
      deckASplashId?: number
      deckBClanId?: number
      deckBRoleId?: number
      deckBSplashId?: number
      deadline?: Date
      podId: number
    }>
    participants: Participant[]
  }>
  brackets: Array<{
    id: number
    tournamentId: number
    bracket: 'silverCup' | 'goldCup'
    challongeTournamentId: number
    url: string
  }>
}
