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

type UserReadModel = Omit<
  UserRecord,
  'discordAccessToken' | 'discordRefreshToken' | 'createdAt' | 'updatedAt'
>

const userColumns = [
  'discordId',
  'discordName',
  'discordDiscriminator',
  'discordAvatar',
  'permissions',
]

export async function getAllUsers(): Promise<UserReadModel[]> {
  return pg('users')
    .column(userColumns)
    .select()
}

export async function getUser(id: string): Promise<UserReadModel> {
  return pg('users')
    .column(userColumns)
    .select()
    .where('discordId', id)
    .first()
}

export async function upsertUser(
  user: Omit<UserRecord, 'permissions' | 'createdAt' | 'updatedAt'>
): Promise<UserRecord> {
  const insert = pg('users').insert({ ...user, permissions: 0 })
  const update = pg.queryBuilder().update({ ...user, updatedAt: new Date() })
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

interface ParticipantRecord {
  id: number
  userId: string
  clanId: number
  tournamentId: number
  timezoneId: number
  timezonePreferenceId: string
}
export async function insertParticipant(
  participant: Omit<ParticipantRecord, 'id'>
): Promise<ParticipantRecord> {
  return pg('participants')
    .insert(participant, '*')
    .then(([row]) => row)
}
