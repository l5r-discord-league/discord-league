import { Tournament$generatePods, WithParsedDates } from '@dl/api'
import P from 'already'
import { Response } from 'express'
import Joi from 'joi'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'
import { groupParticipantsInPods, matchesForPod, namePods } from '../pods'

export const schema = {
  body: Joi.object<WithParsedDates<Tournament$generatePods['request']['body'], 'deadline'>>({
    deadline: Joi.date().required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, Tournament$generatePods['request']['params']>,
  res: Response<Tournament$generatePods['response']>
): Promise<void> {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.sendStatus(400)
    return
  }

  const tournament = await db.fetchTournament(tournamentId)
  if (tournament == null) {
    res.sendStatus(404)
    return
  } else if (tournament.statusId !== 'upcoming') {
    res.sendStatus(403)
    return
  }

  const participants = await db.fetchParticipants(tournamentId)

  const pods = groupParticipantsInPods(tournament.typeId === 'pod6' ? '67' : '78', participants)
  const namedPods = namePods(pods)

  await P.map(namedPods, (pod) =>
    db
      .createTournamentPod({ tournamentId, name: pod.name, timezoneId: pod.timezones[0] })
      .then((createdPod) =>
        P.map(
          matchesForPod(pod),
          ([{ id: playerAId, clanId: deckAClanId }, { id: playerBId, clanId: deckBClanId }]) =>
            db
              .insertMatch({
                playerAId,
                deckAClanId,
                playerBId,
                deckBClanId,
                deadline: req.body.deadline,
              })
              .then((match) => db.connectMatchToPod(match.id, createdPod.id))
        ).then(() => createdPod)
      )
  )

  res.sendStatus(201)
}
