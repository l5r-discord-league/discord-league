import { Tournament$findById } from '@dl/api'
import { api } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export const useTournament = createMapersmithHook<Tournament$findById['response'], number>(
  api.Tournament.findById,
  (tournamentId) => ({ tournamentId })
)
