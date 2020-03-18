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

export type MatchRecordWithPodId = MatchRecord & 'podId'

const matchRecordWithPodIdColumns = [
  'matches.id as id',
  'matches.createdAt as createdAt',
  'matches.updatedAt as updatedAt',
  'matches.playerAId as playerAId',
  'matches.playerBId as playerBId',
  'matches.winnerId as winnerId',
  'matches.firstPlayerId as firstPlayerId',
  'matches.victoryConditionId as victoryConditionId',
  'matches.deckAClanId as deckAClanId',
  'matches.deckARoleId as deckARoleId',
  'matches.deckASplashId as deckASplashId',
  'matches.deckBClanId as deckBClanId',
  'matches.deckBRoleId as deckBRoleId',
  'matches.deckBSplashId as deckBSplashId',
  'matches.deadline as deadline',
  'pods_matches.podId as podId',
]

export async function fetchMatchesForMultiplePods(
  podIds: number[]
): Promise<MatchRecordWithPodId[]> {
  return pg(table)
    .leftJoin('pods_matches', 'matches.id', 'pods_matches.matchId')
    .whereIn('pods_matches.podId', podIds)
    .select(matchRecordWithPodIdColumns)
}
