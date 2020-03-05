import fc from 'fast-check'

import { ParticipantRecord } from '../gateways/storage'

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
    })
  },
}

describe('groupParticipantsInPods', () => {
  describe('given 42 participants or more (all numbers 42+ are compatible)', () => {
    it('create pod distribution with all participants', () => {
      fc.assert(
        fc.property(fc.array(arbitrary.participant({ timezoneId: 1 }), 42, 400), participants => {
          expect(
            groupParticipantsInPods(participants).reduce((sum, ps) => sum + ps.length, 0)
          ).toBe(participants.length)
        })
      )
    })

    it('all pods have 7-8 participants', () => {
      fc.assert(
        fc.property(fc.array(arbitrary.participant({ timezoneId: 1 }), 42, 400), participants => {
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
            const output = groupParticipantsInPods(participants)
            expect(output[0].length).toBe(8)
            expect(output[1].length).toBe(8)
            expect(output[2].length).toBe(8)
            expect(output[3].length).toBe(8)
            expect(output[4].length).toBe(8)
            expect(output[5].length).toBe(8)
            expect(output[6].length).toBe(8)
          }
        )
      )
    })
  })

  describe('given multiple timezones', () => {
    it('create pods with participants that share the same timezone', () => {
      fc.assert(
        fc.property(
          fc
            .tuple(
              fc.array(
                arbitrary.participant({ timezonePreferenceId: 'similar', timezoneId: 1 }),
                8,
                8
              ),
              fc.array(
                arbitrary.participant({ timezonePreferenceId: 'similar', timezoneId: 2 }),
                8,
                8
              )
            )
            .map(([a, b]) => [...a, ...b])
            .chain(ns => fc.shuffledSubarray(ns, 16, 16)),
          participants => {
            const output = groupParticipantsInPods(participants)
            expect(output.length).toBe(2)
            expect(new Set(output[0].map(p => p.timezoneId)).size).toBe(1)
            expect(new Set(output[1].map(p => p.timezoneId)).size).toBe(1)
          }
        )
      )
    })
  })
})
