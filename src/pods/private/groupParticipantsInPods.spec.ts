import { fc, test, testProp } from 'ava-fast-check'

import { ParticipantRecord } from '../../gateways/storage'

import { groupParticipantsInPods } from './groupParticipantsInPods'
import data from './_test_data'

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
    })
  },
}

function sumParticipants(sum: number, pod: { participants: unknown[] }) {
  return sum + pod.participants.length
}

test('given seed data, creates pods with 7 or 8 participants', t => {
  const pods = groupParticipantsInPods(data)

  t.is(data.length, pods.reduce(sumParticipants, 0), 'All players are assigned')
  t.deepEqual(
    pods.filter(pod => pod.participants.length !== 7 && pod.participants.length !== 8),
    [],
    'All pods are the right size'
  )
})

testProp(
  'distributes all participants',
  [fc.array(arbitrary.participant({ timezoneId: 1 }), 42, 400)],
  participants =>
    groupParticipantsInPods(participants).reduce(sumParticipants, 0) === participants.length
)

testProp(
  'all pods have 7 or 8 participants',
  [fc.array(arbitrary.participant({ timezoneId: 1 }), 42, 400)],
  participants =>
    groupParticipantsInPods(participants).filter(
      ps => ps.participants.length !== 7 && ps.participants.length !== 8
    ).length === 0
)
