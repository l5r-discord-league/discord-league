import { Tournament$findAll } from '@dl/api'
import { createMapersmithHook } from '../utils/createMappersmithHook'
import { api } from '../api'

export const useTournaments = createMapersmithHook<Tournament$findAll['response']>(
  api.Tournament.findAll
)
