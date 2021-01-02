import { pg } from './pg'

export const TABLE = 'users'

export interface UserRecord {
  discordId: string
  discordName: string
  discordDiscriminator: string
  discordAvatar: string
  discordAccessToken: string
  discordRefreshToken: string
  permissions: number
  preferredClanId?: number
  jigokuName?: string
  createdAt: Date
  updatedAt: Date
}

export type UserReadModel = Pick<
  UserRecord,
  | 'discordId'
  | 'discordName'
  | 'discordDiscriminator'
  | 'discordAvatar'
  | 'permissions'
  | 'preferredClanId'
  | 'jigokuName'
>

const userColumns = [
  'discordId',
  'discordName',
  'discordDiscriminator',
  'discordAvatar',
  'permissions',
  'preferredClanId',
  'jigokuName',
]

export async function getAllUsers(): Promise<UserReadModel[]> {
  return pg(TABLE).column(userColumns).select()
}

export async function getUser(id: string): Promise<UserReadModel> {
  return pg(TABLE).column(userColumns).select().where('discordId', id).first()
}

export async function upsertUser(
  user: Omit<UserRecord, 'permissions' | 'createdAt' | 'updatedAt'>
): Promise<UserRecord> {
  const insert = pg(TABLE).insert({ ...user, permissions: 0 })
  const update = pg.queryBuilder().update({ ...user, updatedAt: new Date() })
  const result = await pg.raw(`? ON CONFLICT ("discordId") DO ? returning *`, [insert, update])
  return result.rows[0]
}

export async function updateUser(user: UserReadModel): Promise<UserReadModel> {
  const result = await pg(TABLE)
    .where({ discordId: user.discordId })
    .update({ ...user, updatedAt: new Date() }, userColumns)
  return result[0]
}
