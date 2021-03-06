import { pg } from './pg'

export const TABLE = 'users'

export interface UserRecord {
  discordAccessToken: string
  discordAvatar: string
  discordDiscriminator: string
  discordId: string
  discordName: string
  discordRefreshToken: string
  displayTag: string
  displayAvatarURL: string
  permissions: number
  preferredClanId?: number
  jigokuName?: string
  createdAt: Date
  updatedAt: Date
}

export type UserReadModel = Pick<
  UserRecord,
  | 'discordAvatar'
  | 'discordDiscriminator'
  | 'discordId'
  | 'discordName'
  | 'displayAvatarURL'
  | 'displayTag'
  | 'jigokuName'
  | 'permissions'
  | 'preferredClanId'
>

const userColumns = [
  'discordAvatar',
  'discordDiscriminator',
  'discordId',
  'discordName',
  'displayAvatarURL',
  'displayTag',
  'jigokuName',
  'permissions',
  'preferredClanId',
]

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

export async function updateUser(
  discordId: string,
  user: Partial<Omit<UserReadModel, 'discordId'>>
): Promise<UserReadModel> {
  const result = await pg(TABLE)
    .where({ discordId })
    .update({ ...user, updatedAt: new Date() }, userColumns)
  return result[0]
}
