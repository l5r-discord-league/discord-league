import jwt from 'jsonwebtoken'
import passport from 'passport'
import OAuth2Strategy from 'passport-oauth2'
import url from 'url'

import * as discordClient from '../clients/discord'
import env from '../env'

declare global {
  namespace Express {
    interface User {
      jwt: string
    }
  }
}

const scope = ['identify', 'gdm.join']
const callbackURL = `${env.host}/auth/callback`
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

export function discordOAuthStrategy() {
  const discordOAuthStrategy = new OAuth2Strategy(
    {
      authorizationURL,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      clientID: env.discordClientId,
      clientSecret: env.discordClientSecret,
      callbackURL: callbackURL,
    },
    function(
      accessToken: string,
      refreshToken: string,
      profile: unknown,
      verified: (err?: Error | null, user?: object, info?: object) => void
    ) {
      discordClient.getCurrentUser(accessToken).then(user =>
        jwt.sign(user, env.jwtSecret, { expiresIn: '7d' }, (err, jwt) => {
          if (err) {
            throw err
          }
          verified(null, { jwt })
        })
      )
    }
  )
  passport.use(discordOAuthStrategy)
  return passport.initialize()
}

export const discordOAuth = passport.authenticate('oauth2', { session: false })
