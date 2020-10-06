import { fc, test, testProp } from 'ava-fast-check'

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

function sumParticipants(sum: number, pod: { players: unknown[] }) {
  return sum + pod.players.length
}

testProp(
  'distributes all participants',
  [fc.array(arbitrary.participant(), 42, 400)],
  (participants: ParticipantRecord[]) =>
    groupParticipantsInPods(participants).reduce(sumParticipants, 0) === participants.length
)

testProp(
  'all pods have 7 or 8 participants',
  [fc.array(arbitrary.participant(), 42, 400)],
  participants =>
    groupParticipantsInPods(participants).filter(
      ps => ps.players.length !== 7 && ps.players.length !== 8
    ).length === 0
)

testProp(
  'all participants with similar timezone preferences stay in their timezones',
  [fc.array(arbitrary.participant(), 42, 400)],
  participants =>
    groupParticipantsInPods(participants).every(pod =>
      pod.players.every(
        player =>
          pod.timezones.includes(player.timezoneId) || player.timezonePreferenceId !== 'similar'
      )
    )
)
