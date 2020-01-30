import { DiscordUser } from './discord'
import { Clan } from '../constants/clan'
import { Role } from './role'

export class User {
  constructor(
    public discordUser: DiscordUser,
    public role: Role,
    public preferredClan?: Clan,
    public elo?: number,
    public jigokuName?: string
  ) {}
}
