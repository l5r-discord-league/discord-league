import { pg } from './pg'

export const TABLE = 'pods'

export interface TournamentPodRecord {
  id: number
  name: string
  tournamentId: number
  timezoneId: number
}

export async function createTournamentPod(
  tournamentPod: Omit<TournamentPodRecord, 'id'>
): Promise<TournamentPodRecord> {
  return pg(TABLE)
    .insert(tournamentPod, '*')
    .then(([row]) => row)
}

export async function fetchTournamentPods(tournamentId: number): Promise<TournamentPodRecord[]> {
  return pg(TABLE).where('tournamentId', tournamentId)
}

export async function fetchPod(podId: number): Promise<TournamentPodRecord | undefined> {
  return pg(TABLE).where('id', podId).first()
}
