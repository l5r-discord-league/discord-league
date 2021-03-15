import { Tournament$findStatistics } from '@dl/api'
import { api } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export const useTournamentStatistics = createMapersmithHook<
  Tournament$findStatistics['response'],
  number
>(api.Tournament.findStatistics, (tournamentId) => ({ tournamentId }))
