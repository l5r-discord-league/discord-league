import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'
import P from 'already'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'
import { groupParticipantsInPods, matchesForPod, namePods } from '../pods'

export const schema = {
  body: Joi.object<{
    deadline: Date
  }>({
    deadline: Joi.date().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, { tournamentId: string }>,
  res: express.Response
) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  const deadline = req.body.deadline
  if (isNaN(tournamentId)) {
    res.status(400).send()
    return
  }

  const tournament = await db.fetchTournament(tournamentId)
  if (tournament == null) {
    res.status(404).send()
    return
  } else if (tournament.statusId !== 'upcoming') {
    res.status(403).send('The tournament status does not accept pod generation')
    return
  }

  const participants = await db.fetchTournamentParticipants(tournamentId)
  const pods = groupParticipantsInPods(participants)
  const namedPods = namePods(pods)
  const createdPods = await P.map(namedPods, pod =>
    db
      .createTournamentPod({ tournamentId, name: pod.name, timezoneId: pod.timezoneId })
      .then(createdPod =>
        P.map(
          matchesForPod(pod),
          ([{ id: playerAId, clanId: deckAClanId }, { id: playerBId, clanId: deckBClanId }]) =>
            db
              .insertMatch({ playerAId, deckAClanId, playerBId, deckBClanId, deadline })
              .then(match => db.connectMatchToPod(match.id, createdPod.id))
        ).then(() => createdPod)
      )
  )

  res.status(201).send(createdPods)
}
