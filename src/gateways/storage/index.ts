/* eslint-disable @typescript-eslint/camelcase */
import knex from 'knex'

import env from '../../env'

const pg = knex({
  client: 'pg',
  connection: env.nodeEnv === 'development' ? env.databaseUrl : `${env.databaseUrl}?ssl=true`,
  migrations: {
    tableName: 'knex_migrations',
  },
})

export interface UserRecord {
  discordId: string
  discordName: string
  discordDiscriminator: number
  discordAvatar: string
  discordAccessToken: string
  discordRefreshToken: string
  permissions: number
  createdAt: Date
  updatedAt: Date
}

export async function getAllUsers(): Promise<UserRecord[]> {
  return pg('users').select('*')
}

export async function upsertUser(
  user: Omit<UserRecord, 'permissions' | 'createdAt' | 'updatedAt'>
): Promise<UserRecord> {
  const row = { ...user, permissions: 0 }
  const insert = pg('users').insert(row)
  const update = pg.queryBuilder().update({ ...row, updatedAt: new Date() })
  const result = await pg.raw(`? ON CONFLICT ("discordId") DO ? returning *`, [insert, update])
  return result.rows[0]
}

export interface TournamentRecord {
  id: number
  name: string
  startDate: Date
  statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
  typeId: 'monthly'
  description?: string
  createdAt: Date
  updatedAt: Date
}

export async function createTournament(
  tournament: Omit<TournamentRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TournamentRecord> {
  return pg('tournaments')
    .insert(tournament, '*')
    .then(([row]) => row)
}

export async function getAllTournaments(): Promise<TournamentRecord[]> {
  return pg('tournaments').select('*')
}
