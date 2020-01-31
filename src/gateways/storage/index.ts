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
  discord_access_token: string
  discord_refresh_token: string
  permissions: number
  created_at: Date
  updated_at: Date
}

export async function createUser(user: {
  discordId: string
  discordAccessToken: string
  discordRefreshToken: string
}): Promise<UserRecord> {
  const [createdUser] = await pg('users').insert(
    {
      discord_id: user.discordId,
      discord_access_token: user.discordAccessToken,
      discord_refresh_token: user.discordRefreshToken,
      permissions: 0,
    },
    '*'
  )
  return createdUser
}

export async function upsertUser(user: {
  discordId: string
  discordAccessToken: string
  discordRefreshToken: string
}): Promise<UserRecord> {
  const row = {
    discord_id: user.discordId,
    discord_access_token: user.discordAccessToken,
    discord_refresh_token: user.discordRefreshToken,
    permissions: 0,
  }
  const insert = pg('users').insert(row)
  const update = pg.queryBuilder().update(row)
  const result = await pg.raw(`? ON CONFLICT (discord_id) DO ? returning *`, [insert, update])
  return result.rows[0]
}
