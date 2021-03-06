import { Handler } from 'express'
import passport from 'passport'
import OAuth2Strategy from 'passport-oauth2'
import url from 'url'

import * as discordClient from '../clients/discord'
import env from '../env'
import { UserRecord, upsertUser } from '../gateways/storage'
import { JwtPayload, sign } from '../utils/jwt'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User extends Partial<JwtPayload> {
      jwt?: string
    }
  }
}

const scope = ['identify', 'gdm.join']
const callbackURL = `${env.host}/api/auth/callback`
const authorizationURL = url.format({
  protocol: 'https',
  host: 'discordapp.com',
  pathname: '/api/oauth2/authorize',
  query: {
    client_id: env.discordClientId,
    redirect_uri: callbackURL,
    response_type: 'code',
    scope: scope.join(' '),
  },
})

/**
 * Build the payload for the JWT token.
 * The keys should be as short as possible, to keep the token small.
 */
function tokenPayload(dbUser: UserRecord, discordUser: discordClient.DiscordUser): JwtPayload {
  return {
    flags: dbUser.permissions,
    d_id: discordUser.id,
    d_usr: discordUser.username,
    d_tag: discordUser.discriminator,
    d_img: discordUser.avatar,
  }
}

export function discordOAuthStrategy(): Handler {
  const discordOAuthStrategy = new OAuth2Strategy(
    {
      authorizationURL,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      clientID: env.discordClientId,
      clientSecret: env.discordClientSecret,
      callbackURL: callbackURL,
    },
    async function (
      accessToken: string,
      refreshToken: string,
      _profile: unknown,
      verified: (err?: Error | null, user?: { jwt: string }) => void
    ) {
      const discordUser = await discordClient.getCurrentUser(accessToken)
      const dbUser = await upsertUser({
        discordId: discordUser.id,
        discordName: discordUser.username,
        discordDiscriminator: discordUser.discriminator,
        discordAvatar: discordUser.avatar,
        discordAccessToken: accessToken,
        discordRefreshToken: refreshToken,
      })
      const jwt = await sign(tokenPayload(dbUser, discordUser))
      verified(null, { jwt })
    }
  )
  passport.use(discordOAuthStrategy)
  return passport.initialize()
}

export const discordOAuth = passport.authenticate('oauth2', { session: false })
