import { pg } from './pg'

const table = 'matches'

export interface MatchRecord {
  id: number
  createdAt: Date
  updatedAt: Date
  playerAId: number
  playerBId: number
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

export type MatchRecordWithPodId = MatchRecord & { podId: number }

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

export async function fetchMatchesForMultipleParticipants(
  participantIds: number[]
): Promise<MatchRecord[]> {
  return pg(table)
    .whereIn('playerAId', participantIds)
    .orWhereIn('playerBId', participantIds)
}

export async function fetchMatch(matchId: number): Promise<MatchRecord> {
  return pg(table)
    .where('id', matchId)
    .first()
}

export async function updateMatch(
  match: Pick<
    MatchRecord,
    | 'id'
    | 'winnerId'
    | 'firstPlayerId'
    | 'victoryConditionId'
    | 'deckARoleId'
    | 'deckASplashId'
    | 'deckBRoleId'
    | 'deckBSplashId'
  >
): Promise<MatchRecord> {
  const result = await pg(table)
    .where('id', match.id)
    .update({ ...match, updatedAt: new Date() }, '*')
  return result[0]
}
