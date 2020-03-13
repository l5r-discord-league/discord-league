import { pg } from './pg'

const table = 'matches'

export interface MatchRecord {
  id: number
  createdAt: Date
  updatedAt: Date
  playerAId?: number
  playerBId?: number
  winnerId?: number
  firstPlayerId?: number
  victoryConditionId?: number
  deckAClanId?: number
  deckARoleId?: number
  deckASplashId?: number
  deckBClanId?: number
  deckBRoleId?: number
  deckBSplashId?: number
  deadline?: Date
}

export async function insertMatch(
  match: Omit<MatchRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MatchRecord> {
  return pg(table)
    .insert(match, '*')
    .then(([row]) => row)
}

export async function connectMatchToPod(matchId: number, podId: number): Promise<void> {
  return pg('pods_matches').insert({ podId, matchId })
}
