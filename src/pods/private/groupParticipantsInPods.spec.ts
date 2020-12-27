import { fc, testProp } from 'ava-fast-check'

import { ParticipantRecord } from '../../gateways/storage'

import { groupParticipantsInPods } from './groupParticipantsInPods'

const arbitrary = {
  participant(opts?: Partial<ParticipantRecord>) {
    return fc.record<ParticipantRecord>({
      id: opts?.id != null ? fc.constant(opts.id) : fc.nat(),
      userId: opts?.userId != null ? fc.constant(opts.userId) : fc.string(16, 32),
      clanId: opts?.clanId != null ? fc.constant(opts.clanId) : fc.integer(1, 7),
      tournamentId: opts?.tournamentId != null ? fc.constant(opts.tournamentId) : fc.nat(),
      timezoneId: opts?.timezoneId != null ? fc.constant(opts.timezoneId) : fc.integer(1, 7),
      timezonePreferenceId:
        opts?.timezonePreferenceId != null
          ? fc.constant(opts.timezonePreferenceId)
          : fc.constantFrom('similar', 'neutral', 'dissimilar'),
      dropped: fc.boolean(),
      bracket: fc.constant(null),
    })
  },
}

testProp(
  'distributes all participants',
  [fc.array(arbitrary.participant(), 30, 400)],
  (participants: ParticipantRecord[]) => {
    const inputParticipants = new Set(participants)
    const outputParticipants = new Set(
      groupParticipantsInPods(participants).flatMap(pod => pod.players)
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
  [fc.array(arbitrary.participant(), 6 * 7, 6 * 7)],
  participants => groupParticipantsInPods(participants).every(ps => ps.players.length === 6)
)

testProp(
  'all pods have 6 or 7 participants',
  [fc.array(arbitrary.participant(), 30, 400)],
  participants =>
    groupParticipantsInPods(participants).every(
      ps => ps.players.length === 6 || ps.players.length === 7
    )
)

testProp(
  'all participants with similar timezone preferences stay in their timezones',
  [
    fc.array(arbitrary.participant(), 30, 400),
    fc.array(arbitrary.participant({ timezonePreferenceId: 'similar' }), 1, 20),
  ],
  (randomParticipants, similarParticipants) =>
    groupParticipantsInPods([...randomParticipants, ...similarParticipants]).every(pod =>
      pod.players.every(
        player =>
          player.timezonePreferenceId !== 'similar' || pod.timezones.includes(player.timezoneId)
      )
    )
)
