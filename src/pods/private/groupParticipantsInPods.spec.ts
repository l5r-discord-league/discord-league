import { fc, test, testProp } from 'ava-fast-check'

import { ParticipantRecord } from '../../gateways/storage'

import { groupParticipantsInPods } from './groupParticipantsInPods3'
// import { data } from './_test_data'
import { a, b } from './_current_data'

const data = a

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

test.only('given seed data, creates pods with 7 or 8 participants', t => {
  const pods = groupParticipantsInPods(data)

  t.is(pods.reduce(sumParticipants, 0), data.length, 'All players are assigned')
  pods.forEach(pod => {
    t.true(
      pod.participants.every(part => part.tzPref !== 'similar' || part.tz === pod.timezoneId),
      'Respect players timezone preferences'
    )
  })
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
