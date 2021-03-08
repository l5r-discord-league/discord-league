import { Decklist$findAllForTournament } from '@dl/api'
import { api } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export const useTournamentDecklists = createMapersmithHook<
  Decklist$findAllForTournament['response'],
  number
>(api.Decklist.findAllForTournament, (tournamentId) => ({ tournamentId }))
