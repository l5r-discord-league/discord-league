import { AsyncRouter, Request, Response } from 'express-async-router'
import passport from 'passport'

import { ping } from './handlers/ping'

export default () => {
  const router = AsyncRouter()

  router.get('/ping', ping)
  router.get('/auth', passport.authenticate('oauth2', { session: false }))
  router.get('/auth/callback', passport.authenticate('oauth2', { session: false }), function(
    req: Request,
    res: Response
  ) {
    if (!req.user) {
      return res.status(400).send()
    }

    res.status(200).send({ jwt: req.user.jwt })
  })

  return router
}
