import Joi from '@hapi/joi'
import * as express from 'express-serve-static-core'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'
import { getParticipantIdsForMatches } from './getPodWithMatches'

export const schema = {
  body: Joi.object<{
    userId: string
    clanId: number
    timezoneId: number
    timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  }>({
    userId: Joi.string().required(),
    clanId: Joi.number()
      .integer()
      .min(1)
      .required(),
    timezoneId: Joi.number()
      .integer()
      .min(1)
      .required(),
    timezonePreferenceId: Joi.string()
      .valid('similar', 'neutral', 'dissimilar')
      .required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, { podId: string }>,
  res: express.Response
) {
  if (!req.user?.d_id && req.user?.flags !== 1 && req.user?.d_id !== req.body.userId) {
    res.status(403).send('You cannot register this user as participant.')
    return
  }

  // fetch pod
  const podId = parseInt(req.params.podId, 10)
  if (isNaN(podId)) {
    res.status(400).send()
    return
  }
  const pod = await db.fetchPod(podId)
  if (!pod) {
    res.status(400).send()
    return
  }

  // create participation
  const tournamentId = pod.tournamentId
  const participant = await db.insertParticipant({
    userId: req.body.userId,
    tournamentId: tournamentId,
    clanId: req.body.clanId,
    timezoneId: req.body.timezoneId,
    timezonePreferenceId: req.body.timezonePreferenceId,
  })
  const newParticipant = await db.fetchParticipantWithUserData(participant.id)

  // find other participations in the pod
  const matches = await db.fetchMatchesForMultiplePods([pod.id])
  const deadline = matches ? matches[0].deadline : undefined
  const participantIds = getParticipantIdsForMatches(matches)
  const participants = await db.fetchMultipleParticipantsWithUserData(participantIds)

  // create a match with each participant
  for (let participant of participants) {
    const match = {
      playerAId: participant.id,
      deckAClanId: participant.clanId,
      playerBId: newParticipant.id,
      deckBClanId: newParticipant.clanId,
      deadline: deadline
    }
    db
      .insertMatch(match)
      .then(match => db.connectMatchToPod(match.id, podId))
  }
  res.status(201).send()
}
