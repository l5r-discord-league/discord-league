import * as API from '@dl/api'
import { api } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export type Match = API.MatchData

export const useTournamentPod = createMapersmithHook<API.Pod$findById['response'], string>(
  api.Pod.findById,
  (podId) => ({
    podId,
  })
)
