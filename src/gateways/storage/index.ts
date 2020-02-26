/* eslint-disable @typescript-eslint/camelcase */
import knex from 'knex'

import env from '../../env'

export const pg = knex({
  client: 'pg',
  connection: env.nodeEnv === 'development' ? env.databaseUrl : `${env.databaseUrl}?ssl=true`,
  migrations: {
    tableName: 'knex_migrations',
  },
})

export interface UserRecord {
  discord_id: string
  discord_name: string
  discord_discriminator: string
  discord_avatar: string
  discord_access_token: string
  discord_refresh_token: string
  permissions: number
  created_at: Date
  updated_at: Date
}

export type TournamentType = 'monthly'

export type TournamentStatus = 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'

export interface TournamentRecord {
  id: number
  name: string
  startDate: Date
  status: TournamentStatus
  type: TournamentType
  description?: string
  createdAt: Date
  updatedAt: Date
}

export async function upsertUser(user: {
  discordId: string
  discordName: string
  discordDiscriminator: string
  discordAvatar: string
  discordAccessToken: string
  discordRefreshToken: string
}): Promise<UserRecord> {
  const row = {
    discord_id: user.discordId,
    discord_name: user.discordName,
    discord_discriminator: user.discordDiscriminator,
    discord_avatar: user.discordAvatar,
    discord_access_token: user.discordAccessToken,
    discord_refresh_token: user.discordRefreshToken,
    permissions: 0,
  }
  const insert = pg('users').insert(row)
  const update = pg.queryBuilder().update(row)
  const result = await pg.raw(`? ON CONFLICT (discord_id) DO ? returning *`, [insert, update])
  return result.rows[0]
}

export async function createTournament({
  description,
  name,
  startDate,
  status,
  type,
}: Pick<TournamentRecord, 'name' | 'startDate' | 'status' | 'type' | 'description'>): Promise<
  TournamentRecord
> {
  return pg('tournaments')
    .insert({ name, description, start_date: startDate, status_id: status, type_id: type }, '*')
    .then(([row]) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      startDate: row.start_date,
      status: row.status_id,
      type: row.type_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
}

export async function getAllTournaments(): Promise<TournamentRecord[]> {
  return pg('tournaments').select('*')
}

export async function getAllUsers(): Promise<UserRecord[]> {
  return pg('users').select('*')
}
