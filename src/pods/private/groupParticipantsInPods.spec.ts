import { fc, testProp } from 'ava-fast-check'

import { ParticipantRecord } from '../../gateways/storage'

import { groupParticipantsInPods } from './groupParticipantsInPods'
import * as arbitrary from './__test_helpers'

testProp(
  'distributes all participants',
  [fc.array(arbitrary.player(), 30, 400)],
  (participants: ParticipantRecord[]) => {
    const inputParticipants = new Set(participants)
    const outputParticipants = new Set(
      groupParticipantsInPods(participants).flatMap((pod) => pod.players)
    )

    if (inputParticipants.size !== outputParticipants.size) {
      return false
    }

    for (const participant of inputParticipants) {
      if (!outputParticipants.has(participant)) {
        return false
      }
    }

    return true
  }
)

testProp(
  'pods prefer to be 6-sized than 7-sized',
  [fc.array(arbitrary.player(), 6 * 7, 6 * 7)],
  (participants) => groupParticipantsInPods(participants).every((ps) => ps.players.length === 6)
)

testProp(
  'all pods have 6 or 7 participants',
  [fc.array(arbitrary.player(), 30, 400)],
  (participants) =>
    groupParticipantsInPods(participants).every(
      (ps) => ps.players.length === 6 || ps.players.length === 7
    )
)

testProp(
  'all participants with similar timezone preferences stay in their timezones',
  [
    fc.array(arbitrary.player(), 30, 400),
    fc.array(arbitrary.player({ timezonePreferenceId: 'similar' }), 1, 20),
  ],
  (randomParticipants, similarParticipants) =>
    groupParticipantsInPods([...randomParticipants, ...similarParticipants]).every((pod) =>
      pod.players.every(
        (player) =>
          player.timezonePreferenceId !== 'similar' || pod.timezones.includes(player.timezoneId)
      )
    )
)
