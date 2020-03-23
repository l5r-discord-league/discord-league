import { AsyncRouter, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'
import * as express from 'express'

import { ping } from './handlers/ping'
import * as createTournament from './handlers/createTournament'
import * as updateTournament from './handlers/updateTournament'
import * as deleteTournament from './handlers/deleteTournament'
import * as createParticipant from './handlers/createParticipant'
import * as updateParticipant from './handlers/updateParticipant'
import * as updateMatch from './handlers/updateMatch'
import * as deleteParticipant from './handlers/deleteParticipant'
import * as generatePods from './handlers/generatePods'
import * as getAllTournaments from './handlers/getAllTournaments'
import * as getAllUsers from './handlers/getAllUsers'
import * as getUser from './handlers/getUser'
import * as getMatchesForUser from './handlers/getMatchesForUser'
import * as getTournament from './handlers/getTournament'
import * as getParticipants from './handlers/getParticipants'
import * as getPodsWithMatchesForTournament from './handlers/getPodsWithMatchesForTournament'
import * as getPodWithMatches from './handlers/getPodWithMatches'
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
  api.get('/user/:id/matches', getMatchesForUser.handler)

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
  api.get('/tournament/:tournamentId/participant', getParticipants.handler)
  api.post(
    '/tournament/:tournamentId/participant',
    authenticate,
    validate(createParticipant.schema),
    createParticipant.handler
  )
  api.delete('/tournament/:tournamentId/participant/:id', authenticate, deleteParticipant.handler)
  api.put(
    '/tournament/:tournamentId/participant/:id',
    authenticate,
    validate(updateParticipant.schema),
    updateParticipant.handler
  )
  api.post(
    '/tournament/:tournamentId/generate-pods',
    authenticate,
    onlyAdmin,
    validate(generatePods.schema),
    generatePods.handler
  )
  api.get('/tournament/:tournamentId/pods', getPodsWithMatchesForTournament.handler)
  api.get('/pod/:podId', getPodWithMatches.handler)
  api.put('/match/:id', authenticate, validate(updateMatch.schema), updateMatch.handler)

  return api
}
