import { pg } from '../gateways/storage'

interface UserRow {
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

export async function selectAllUsers(): Promise<
  Array<
    Pick<
      UserRow,
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
  >
> {
  return pg
    .raw(
      `
    SELECT
      "discordAvatar",
      "discordDiscriminator",
      "discordId",
      "discordName",
      "displayAvatarURL",
      "displayTag",
      "jigokuName",
      "permissions",
      "preferredClanId"
    FROM "users"
  `
    )
    .then(({ rows }) => rows)
}
