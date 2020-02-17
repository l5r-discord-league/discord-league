import { AsyncRouter, Request, Response, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'

import { ping } from './handlers/ping'
import { SeasonController } from './season/tournamentController'
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
  api.get('/tournament', seasonController.getAllSeasons)
  api.get('/tournament/:id', seasonController.getTournamentForId)
  api.post('/tournament', seasonController.createTournament)
  api.put('/tournament/:id', seasonController.editTournament)
  api.delete('/tournament/:id', seasonController.deleteTournament)

  return api
}
