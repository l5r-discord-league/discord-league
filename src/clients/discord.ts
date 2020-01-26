import forge from 'mappersmith'

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
  mfa_enabled: boolean
  flags: number
}

export async function getCurrentUser(token: string): Promise<DiscordUser> {
  return discordClient.Users.getCurrent({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.data())
}
