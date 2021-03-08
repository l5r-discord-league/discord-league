import { Pod$findById } from '@dl/api'
import { api } from '../api'
import { createMapersmithHook } from '../utils/createMappersmithHook'

export const useTournamentPod = createMapersmithHook<Pod$findById['response'], string>(
  api.Pod.findById,
  (podId) => ({ podId })
)
