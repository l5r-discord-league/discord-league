import { AsyncRouter, Request, Response, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'

import { ping } from './handlers/ping'
import { getExampleSeasons } from './season/season'

export default (): AsyncRouterInstance => {
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

    res.redirect(303, `/?token=${req.user.jwt}`)
  })
  router.get('/seasons', getExampleSeasons)

  return router
}
