import { api, Tournament$findById } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export const useTournament = createMapersmithHook<Tournament$findById, number>(
  api.Tournament.findById,
  (tournamentId) => ({ tournamentId })
)
