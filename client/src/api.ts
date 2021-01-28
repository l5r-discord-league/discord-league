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
  prepareRequest(next, abort) {
    return next().then((request) => {
      const bearerToken = getToken()
      return bearerToken == null
        ? abort(new Error('"x-special" must be set!'))
        : request.enhance({ headers: { Authorization: `Bearer ${bearerToken}` } })
    })
  },
})

export const api = forge({
  clientId: 'dl-client',
  middleware: [BearerToken, EncodeJson, GlobalErrorHandler],
  resources: {
    Tournament: {
      findById: { method: 'GET', path: '/api/tournament/{tournamentId}' },
    },
  },
})

export type Tournament$findById = {
  tournament: {
    id: number
    name: string
    startDate: Date
    statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
    typeId: 'monthly' | 'pod6'
    description?: string
    createdAt: Date
    updatedAt: Date
  }
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
    participants: Array<{
      id: number
      userId: string
      clanId: number
      dropped: boolean
      discordAvatar: string
      discordDiscriminator: string
      discordId: string
      discordName: string
      bracket: 'silverCup' | 'goldCup' | null
      wins: number
      losses: number
      position: number
    }>
  }>
  brackets: Array<{
    id: number
    tournamentId: number
    bracket: 'silverCup' | 'goldCup'
    challongeTournamentId: number
    url: string
  }>
}
