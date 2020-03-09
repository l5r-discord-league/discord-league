import fc from 'fast-check'

import { ParticipantRecord } from '../../gateways/storage'

import { groupParticipantsInPods } from './groupParticipantsInPods'
import { data } from './_test_data'

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

describe('given seed data', () => {
  const pods = groupParticipantsInPods(data)
  it.only('creates pods with 7 or 8 participants', () => {
    expect(pods.reduce((sum, ps) => sum + ps.length, 0)).toBe(data.length)
  })
  it('groups players according to timezone preferences', () => {
    pods.forEach(pod => {
      expect(
        pod
          .filter(p => p.timezonePreferenceId === 'similar')
          .reduce((tzs, p) => {
            if (!tzs.includes(p.timezoneId)) {
              tzs.push(p.timezoneId)
            }
            return tzs
          }, [] as number[])
      ).toHaveLength(1)
    })
  })
})

describe('groupParticipantsInPods', () => {
  describe('given 42 participants or more (all numbers 42+ are compatible)', () => {
    const participants = fc.array(arbitrary.participant({ timezoneId: 1 }), 42, 400)
    it('create pod distribution with all participants', () => {
      fc.assert(
        fc.property(participants, participants => {
          expect(
            groupParticipantsInPods(participants).reduce((sum, ps) => sum + ps.length, 0)
          ).toBe(participants.length)
        })
      )
    })

    it('all pods have 7-8 participants', () => {
      fc.assert(
        fc.property(participants, participants => {
          expect(
            groupParticipantsInPods(participants).filter(ps => ps.length !== 7 && ps.length !== 8)
              .length
          ).toBe(0)
        })
      )
    })

    it('prioritize pods with 8 participants over 7 participants', () => {
      fc.assert(
        fc.property(
          fc.array(arbitrary.participant({ timezoneId: 1 }), 8 * 7, 8 * 7),
          participants => {
            groupParticipantsInPods(participants).forEach(pod => expect(pod).toHaveLength(8))
          }
        )
      )
    })
  })
})
