import { pg } from './pg'
import { TABLE as PODS_MATCHES } from './podsMatches'

export const TABLE = 'matches'

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

export type MatchRecordWithPodId = MatchRecord & { podId: number }

const matchRecordWithPodIdColumns = [
  `${TABLE}.id as id`,
  `${TABLE}.createdAt as createdAt`,
  `${TABLE}.updatedAt as updatedAt`,
  `${TABLE}.playerAId as playerAId`,
  `${TABLE}.playerBId as playerBId`,
  `${TABLE}.winnerId as winnerId`,
  `${TABLE}.firstPlayerId as firstPlayerId`,
  `${TABLE}.victoryConditionId as victoryConditionId`,
  `${TABLE}.deckAClanId as deckAClanId`,
  `${TABLE}.deckARoleId as deckARoleId`,
  `${TABLE}.deckASplashId as deckASplashId`,
  `${TABLE}.deckBClanId as deckBClanId`,
  `${TABLE}.deckBRoleId as deckBRoleId`,
  `${TABLE}.deckBSplashId as deckBSplashId`,
  `${TABLE}.deadline as deadline`,
  `${PODS_MATCHES}.podId as podId`,
]

export async function insertMatch(
  match: Omit<MatchRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MatchRecord> {
  return pg(TABLE)
    .insert(match, '*')
    .then(([row]) => row)
}

export async function fetchMatchesForMultiplePods(
  podIds: number[]
): Promise<MatchRecordWithPodId[]> {
  return pg(TABLE)
    .leftJoin(`${PODS_MATCHES}`, 'matches.id', `${PODS_MATCHES}.matchId`)
    .whereIn(`${PODS_MATCHES}.podId`, podIds)
    .select(matchRecordWithPodIdColumns)
}

export async function fetchMatchesForMultipleParticipants(
  participantIds: number[]
): Promise<MatchRecord[]> {
  return pg(TABLE).whereIn('playerAId', participantIds).orWhereIn('playerBId', participantIds)
}

export async function fetchMatch(matchId: number): Promise<MatchRecord> {
  return pg(TABLE).where('id', matchId).first()
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
  const result = await pg(TABLE)
    .where('id', match.id)
    .update({ ...match, updatedAt: new Date() }, '*')
  return result[0]
}

export async function deleteMatchReport(matchId: number): Promise<MatchRecord> {
  const result = await pg(TABLE)
    .where('id', matchId)
    .update(
      {
        winnerId: pg.raw('DEFAULT'),
        firstPlayerId: pg.raw('DEFAULT'),
        victoryConditionId: pg.raw('DEFAULT'),
        deckARoleId: pg.raw('DEFAULT'),
        deckASplashId: pg.raw('DEFAULT'),
        deckBRoleId: pg.raw('DEFAULT'),
        deckBSplashId: pg.raw('DEFAULT'),
        updatedAt: new Date(),
      },
      '*'
    )
  return result[0]
}

export async function deleteMatches(matchIds: number[]): Promise<void> {
  return pg(TABLE)
    .whereIn('id', matchIds)
    .del()
    .then(() => undefined)
}
