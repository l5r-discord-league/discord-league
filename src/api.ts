import { AsyncRouter, Request, Response, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'

import { ping } from './handlers/ping'
import { SeasonController } from './season/seasonController'
import { authenticate } from './middlewares/auth'

export default (): AsyncRouterInstance => {
  const api = AsyncRouter()
  const seasonController = new SeasonController({})

  api.get('/ping', ping)
  api.get('/auth', passport.authenticate('oauth2', { session: false }))
  api.get('/auth/callback', passport.authenticate('oauth2', { session: false }), function(
    req: Request,
    res: Response
  ) {
    if (!req.user) {
      return res.status(400).send()
    }

    res.redirect(303, `/?token=${req.user.jwt}`)
  })

  api.get('/test', authenticate, (req, res) => {
    res.json(req.user)
  })
  api.get('/season', seasonController.getAllSeasons)
  api.get('/season/:id', seasonController.getSeasonForId)
  api.post('/season', seasonController.createSeason)
  api.put('/season/:id', seasonController.editSeason)
  api.delete('/season/:id', seasonController.deleteSeason)

  return api
}
