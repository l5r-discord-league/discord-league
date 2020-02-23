import { AsyncRouter, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'
import * as express from 'express'

import { ping } from './handlers/ping'
import { SeasonController } from './season/tournamentController'
import * as createTournament from './handlers/createTournament'
import { authenticate, onlyAdmin } from './middlewares/authorization'
import { validate } from './middlewares/validator'

export default (): AsyncRouterInstance => {
  const api = AsyncRouter()
  const seasonController = new SeasonController({})

  api.get('/ping', ping)
  api.get('/auth', passport.authenticate('oauth2', { session: false }))
  api.get('/auth/callback', passport.authenticate('oauth2', { session: false }), function(
    req: express.Request,
    res: express.Response
  ) {
    if (!req.user) {
      return res.status(400).send()
    }

    res.redirect(303, `/?token=${req.user.jwt}`)
  })

  api.get('/tournament', seasonController.getAllSeasons)
  api.get('/tournament/:id', seasonController.getTournamentForId)
  api.post(
    '/tournament',
    authenticate,
    onlyAdmin,
    validate(createTournament.schema),
    createTournament.handler
  )
  api.put('/tournament/:id', seasonController.editTournament)
  api.delete('/tournament/:id', seasonController.deleteTournament)

  return api
}
