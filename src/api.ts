import { AsyncRouter, AsyncRouterInstance } from 'express-async-router'
import passport from 'passport'
import * as express from 'express'

import { ping } from './handlers/ping'
import * as createTournament from './handlers/createTournament'
import * as updateTournament from './handlers/updateTournament'
import * as deleteTournament from './handlers/deleteTournament'
import * as dropParticipant from './handlers/dropParticipant'
import * as createParticipant from './handlers/createParticipant'
import * as updateParticipant from './handlers/updateParticipant'
import * as updateMatchReport from './handlers/updateMatchReport'
import * as deleteMatchReport from './handlers/deleteMatchReport'
import * as deleteParticipant from './handlers/deleteParticipant'
import * as generatePods from './handlers/generatePods'
import * as closeGroupStage from './handlers/closeGroupStage'
import * as startBracketStage from './handlers/startBracketStage'
import * as closeBracketStage from './handlers/closeBracketStage'
import * as getAllTournaments from './handlers/getAllTournaments'
import * as getAllUsers from './handlers/getAllUsers'
import * as getUser from './handlers/getUser'
import * as getMatchesForUser from './handlers/getMatchesForUser'
import * as getTournament from './handlers/getTournament'
import * as createParticipantInPod from './handlers/createParticipantInPod'
import * as getDecklistsForTournament from './handlers/getDecklistsForTournament'
import * as createDecklist from './handlers/createDecklist'
import * as getDecklist from './handlers/getDecklist'
import * as updateDecklist from './handlers/updateDecklist'
import * as deleteDecklist from './handlers/deleteDecklist'
import * as getPodWithMatches from './handlers/getPodWithMatches'
import * as getCurrentUser from './handlers/getCurrentUser'
import * as updateUserProfile from './handlers/updateUserProfile'
import { authenticate, onlyAdmin, withBearerToken } from './middlewares/authorization'
import { validate } from './middlewares/validator'

export default (): AsyncRouterInstance => {
  const api = AsyncRouter()

  api.get('/ping', ping)
  api.get('/auth', passport.authenticate('oauth2', { session: false }))
  api.get(
    '/auth/callback',
    passport.authenticate('oauth2', { session: false }),
    function (req: express.Request, res: express.Response) {
      if (!req.user) {
        return res.status(400).send()
      }

      res.redirect(303, `/?token=${req.user.jwt}`)
    }
  )

  api.get('/user', getAllUsers.handler)
  api.get('/user/current', authenticate, getCurrentUser.handler)
  api.get('/user/:userId', getUser.handler)
  api.patch('/user/:userId', authenticate, updateUserProfile.handler)
  api.get('/user/:userId/matches', getMatchesForUser.handler)

  api.get('/tournament', getAllTournaments.handler)
  api.get('/tournament/:tournamentId', getTournament.handler)
  api.put(
    '/tournament/:tournamentId',
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
  api.delete('/tournament/:tournamentId', authenticate, onlyAdmin, deleteTournament.handler)
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
  api.post(
    '/tournament/:tournamentId/close-group-stage',
    authenticate,
    onlyAdmin,
    closeGroupStage.handler
  )
  api.post(
    '/tournament/:tournamentId/start-bracket-stage',
    authenticate,
    onlyAdmin,
    startBracketStage.handler
  )
  api.post(
    '/tournament/:tournamentId/close-bracket-stage',
    authenticate,
    onlyAdmin,
    closeBracketStage.handler
  )

  api.post('/participant/:participantId/drop', authenticate, dropParticipant.handler)

  api.get('/tournament/:tournamentId/decklists', withBearerToken, getDecklistsForTournament.handler)
  api.get('/participant/:participantId/decklist', getDecklist.handler)
  api.post(
    '/participant/:participantId/decklist',
    authenticate,
    validate(createDecklist.schema),
    createDecklist.handler
  )
  api.put(
    '/participant/:participantId/decklist',
    authenticate,
    validate(updateDecklist.schema),
    updateDecklist.handler
  )
  api.delete('/participant/:participantId/decklist', authenticate, deleteDecklist.handler)

  api.get('/pod/:podId', getPodWithMatches.handler)

  api.post(
    '/pod/:podId/participant',
    authenticate,
    onlyAdmin,
    validate(createParticipant.schema),
    createParticipantInPod.handler
  )
  api.put(
    '/match/:matchId/report',
    authenticate,
    validate(updateMatchReport.schema),
    updateMatchReport.handler
  )
  api.delete('/match/:id/report', authenticate, onlyAdmin, deleteMatchReport.handler)

  return api
}
