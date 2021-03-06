import forge from 'mappersmith'
import Discord, { User } from 'discord.js'
import env from '../env'

const client = new Discord.Client()
client.login(env.discordBotToken)

const discordClient = forge({
  clientId: 'discord',
  host: 'https://discordapp.com',
  resources: {
    Users: {
      getCurrent: {
        path: '/api/users/@me',
      },
    },
  },
})

export interface DiscordUser {
  id: string
  username: string
  avatar: string
  discriminator: string
  locale: string
  // eslint-disable-next-line camelcase
  mfa_enabled: boolean
  flags: number
}

export async function getCurrentUser(token: string): Promise<DiscordUser> {
  return discordClient.Users.getCurrent({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.data())
}

export async function fetchUser(userId: string): Promise<User> {
  return client.users.fetch(userId)
}
