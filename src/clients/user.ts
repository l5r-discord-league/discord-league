import { DiscordUser } from './discord'
import { Clan } from '../constants/clan'
import { Role } from './role'

export interface User {
  discordUser: DiscordUser
  preferredClan?: Clan
  elo?: number
  jigokuName?: string
  role: Role
}
