import { AsyncRouter, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'
import * as express from 'express'

import { ping } from './handlers/ping'
import * as createTournament from './handlers/createTournament'
import * as updateTournament from './handlers/updateTournament'
import * as deleteTournament from './handlers/deleteTournament'
import * as createTournamentParticipant from './handlers/createTournamentParticipant'
import * as updateTournamentParticipant from './handlers/updateTournamentParticipant'
import * as deleteTournamentParticipant from './handlers/deleteTournamentParticipant'
import * as generatePods from './handlers/generatePods'
import * as getAllTournaments from './handlers/getAllTournaments'
import * as getAllUsers from './handlers/getAllUsers'
import * as getUser from './handlers/getUser'
import * as getTournament from './handlers/getTournament'
import * as getTournamentParticipants from './handlers/getTournamentParticipants'
import * as getCurrentUser from './handlers/getCurrentUser'
import * as updateUserProfile from './handlers/updateUserProfile'
import { authenticate, onlyAdmin } from './middlewares/authorization'
import { validate } from './middlewares/validator'

export default (): AsyncRouterInstance => {
  const api = AsyncRouter()

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

  api.get('/user', getAllUsers.handler)
  api.get('/user/current', authenticate, getCurrentUser.handler)
  api.get('/user/:id', getUser.handler)

  api.put('/user/:id', authenticate, updateUserProfile.handler)

  api.get('/tournament', getAllTournaments.handler)
  api.get('/tournament/:id', getTournament.handler)
  api.put(
    '/tournament/:id',
    authenticate,
    onlyAdmin,
    validate(updateTournament.schema),
    updateTournament.handler
  )
  api.post(
    '/tournament',
    authenticate,
    onlyAdmin,
    validate(createTournament.schema),
    createTournament.handler
  )
  api.delete('/tournament/:id', authenticate, onlyAdmin, deleteTournament.handler)
  api.get('/tournament/:tournamentId/participant', getTournamentParticipants.handler)
  api.post(
    '/tournament/:tournamentId/participant',
    authenticate,
    validate(createTournamentParticipant.schema),
    createTournamentParticipant.handler
  )
  api.delete(
    '/tournament/:tournamentId/participant/:id',
    authenticate,
    deleteTournamentParticipant.handler
  )
  api.put(
    '/tournament/:tournamentId/participant/:id',
    authenticate,
    validate(updateTournamentParticipant.schema),
    updateTournamentParticipant.handler
  )
  api.post(
    '/tournament/:tournamentId/generate-pods',
    authenticate,
    onlyAdmin,
    validate(generatePods.schema),
    generatePods.handler
  )

  return api
}
