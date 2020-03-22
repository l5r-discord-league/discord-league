import { pg } from './pg'

export const TABLE = 'pods_matches'

export async function connectMatchToPod(matchId: number, podId: number): Promise<void> {
  return pg(TABLE).insert({ podId, matchId })
}
