import * as express from 'express-serve-static-core'
import Joi from 'joi'

import * as db from '../gateways/storage'
import { ValidatedRequest } from '../middlewares/validator'

export const schema = {
  body: Joi.object<{
    userId: string
    clanId: number
    timezoneId: number
    timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  }>({
    userId: Joi.string().required(),
    clanId: Joi.number().integer().min(1).required(),
    timezoneId: Joi.number().integer().min(1).required(),
    timezonePreferenceId: Joi.string().valid('similar', 'neutral', 'dissimilar').required(),
  }),
}

export async function handler(
  req: ValidatedRequest<typeof schema, { podId: string }>,
  res: express.Response
): Promise<void> {
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

  const newParticipant = await db.insertParticipant({
    tournamentId: pod.tournamentId,
    clanId: req.body.clanId,
    timezoneId: req.body.timezoneId,
    timezonePreferenceId: req.body.timezonePreferenceId,
    userId: req.body.userId,
  })

  const matches = await db.fetchMatchesForMultiplePods([pod.id])
  const deadline = matches ? matches[0].deadline : undefined
  const participants = await db.fetchMultipleParticipantsWithUserData(
    matches.flatMap((match) => [match.playerAId, match.playerBId])
  )

  await Promise.all(
    participants.map((participant) =>
      db
        .insertMatch({
          playerAId: participant.id,
          deckAClanId: participant.clanId,
          playerBId: newParticipant.id,
          deckBClanId: newParticipant.clanId,
          deadline: deadline,
        })
        .then((match) => db.connectMatchToPod(match.id, podId))
    )
  )

  res.status(201).send()
}
