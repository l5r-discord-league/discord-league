import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'
import { Pod, groupParticipantsInPods, matchesForPod } from '../pods'
import { data } from '../pods/private/_test_data'

export const schema = {
  body: Joi.object<{}>({}),
}

export async function handler(
  req: ValidatedRequest<typeof schema, { tournamentId: string }>,
  res: express.Response
) {
  const tournamentId = parseInt(req.params.tournamentId, 10)
  if (isNaN(tournamentId)) {
    res.status(400).send()
    return
  }

  const tournament = await db.fetchTournament(tournamentId)
  if (tournament.statusId !== 'upcoming') {
    res.status(403).send('The tournament status does not accept pod generation')
    return
  }

  const participants = await db.fetchTournamentParticipants(tournamentId)
  let pods: Pod[]
  try {
    pods = groupParticipantsInPods(data.map(p => ({ ...p, tournamentId, userId: 'test' })))
  } catch (e) {
    res.status(500).send(e.message)
    return
  }

  const matchesForPods = pods.map(matchesForPod)
  console.log(matchesForPods.map(m => m.length).reduce((a, b) => a + b))

  // const participant = await db.insertParticipant({
  //   userId,
  //   tournamentId,
  //   clanId: req.body.clanId,
  //   timezoneId: req.body.timezoneId,
  //   timezonePreferenceId: req.body.timezonePreferenceId,
  // })
  res.status(201).send(tournament)
}
