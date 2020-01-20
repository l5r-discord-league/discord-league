import jwt from 'jsonwebtoken'
import passport from 'passport'
import OAuth2Strategy from 'passport-oauth2'

import * as discordClient from '../clients/discord'
import env from '../env'

declare global {
  namespace Express {
    interface User {
      jwt: string
    }
  }
}

export function discordOAuthStrategy() {
  const discordOAuthStrategy = new OAuth2Strategy(
    {
      authorizationURL: `https://discordapp.com/api/oauth2/authorize?client_id=${env.discordClientId}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Fcallback&response_type=code&scope=identify%20gdm.join`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      clientID: env.discordClientId,
      clientSecret: env.discordClientSecret,
      callbackURL: `http://localhost:${env.serverPort}/auth/callback`,
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
