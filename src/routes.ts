import { AsyncRouter, Request, Response, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'

import { ping } from './handlers/ping'
import { SeasonController } from './season/seasonController'
import { authenticate } from './middlewares/auth'

export default (): AsyncRouterInstance => {
  const router = AsyncRouter()
  const seasonController = new SeasonController({})

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

  router.get('/test', authenticate, (req, res) => {
    res.json(req.user)
  })
  router.get('/season', seasonController.getAllSeasons)
  router.get('/season/:id', seasonController.getSeasonForId)
  router.post('/season', seasonController.createSeason)
  router.put('/season/:id', seasonController.editSeason)
  router.delete('/season/:id', seasonController.deleteSeason)

  return router
}
