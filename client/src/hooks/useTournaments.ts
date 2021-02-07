import { createMapersmithHook } from '../utils/createMappersmithHook'
import { api, Tournament$findAll, Tournament as T } from '../api'

export type Tournament = T

export const useTournaments = createMapersmithHook<Tournament$findAll>(api.Tournament.findAll)
