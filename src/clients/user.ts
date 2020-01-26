import {DiscordUser} from "./discord"
import {Clan} from "../constants/clan"

export interface User {
    discordUser: DiscordUser
    preferredClan?: Clan
    elo?: number
    jigokuName?: string
}