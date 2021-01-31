import { fc } from 'ava-fast-check'

import { Player, Match } from './types'

export function player(opts?: Partial<Player>): fc.Arbitrary<Player> {
  return fc.record<Player>({
    id: opts?.id != null ? fc.constant(opts.id) : fc.nat(),
    userId: opts?.userId != null ? fc.constant(opts.userId) : fc.string(16, 32),
    clanId: opts?.clanId != null ? fc.constant(opts.clanId) : fc.integer(1, 7),
    tournamentId: opts?.tournamentId != null ? fc.constant(opts.tournamentId) : fc.nat(),
    timezoneId: opts?.timezoneId != null ? fc.constant(opts.timezoneId) : fc.integer(1, 7),
    timezonePreferenceId:
      opts?.timezonePreferenceId != null
        ? fc.constant(opts.timezonePreferenceId)
        : fc.constantFrom('similar', 'neutral', 'dissimilar'),
    dropped: opts?.dropped != null ? fc.constant(opts.dropped) : fc.boolean(),
    bracket: opts?.bracket != null ? fc.constant(opts.bracket) : fc.constant(null),
  })
}

export function match(opts?: Partial<Match>): fc.Arbitrary<Match> {
  return fc.record<Match>({
    id: opts?.id != null ? fc.constant(opts.id) : fc.nat(),
    createdAt: opts?.createdAt != null ? fc.constant(opts.createdAt) : fc.date(),
    updatedAt: opts?.updatedAt != null ? fc.constant(opts.updatedAt) : fc.date(),
    playerAId: opts?.playerAId != null ? fc.constant(opts.playerAId) : fc.nat(),
    playerBId: opts?.playerBId != null ? fc.constant(opts.playerBId) : fc.nat(),
    winnerId:
      opts && 'winnerId' in opts
        ? opts.winnerId === null
          ? fc.constant(undefined)
          : fc.constant(opts.winnerId)
        : fc.nat(),
    firstPlayerId:
      opts && 'firstPlayerId' in opts
        ? opts.firstPlayerId === null
          ? fc.constant(undefined)
          : fc.constant(opts.firstPlayerId)
        : fc.nat(),
    victoryConditionId:
      opts && 'victoryConditionId' in opts
        ? opts.victoryConditionId === null
          ? fc.constant(undefined)
          : fc.constant(opts.victoryConditionId)
        : fc.nat(),
    deckAClanId:
      opts && 'deckAClanId' in opts
        ? opts.deckAClanId === null
          ? fc.constant(undefined)
          : fc.constant(opts.deckAClanId)
        : fc.nat(),
    deckBClanId:
      opts && 'deckBClanId' in opts
        ? opts.deckBClanId === null
          ? fc.constant(undefined)
          : fc.constant(opts.deckBClanId)
        : fc.nat(),
    deckASplashId:
      opts && 'deckASplashId' in opts
        ? opts.deckASplashId === null
          ? fc.constant(undefined)
          : fc.constant(opts.deckASplashId)
        : fc.nat(),
    deckBSplashId:
      opts && 'deckBSplashId' in opts
        ? opts.deckBSplashId === null
          ? fc.constant(undefined)
          : fc.constant(opts.deckBSplashId)
        : fc.nat(),
    deckARoleId:
      opts && 'deckARoleId' in opts
        ? opts.deckARoleId === null
          ? fc.constant(undefined)
          : fc.constant(opts.deckARoleId)
        : fc.nat(),
    deckBRoleId:
      opts && 'deckBRoleId' in opts
        ? opts.deckBRoleId === null
          ? fc.constant(undefined)
          : fc.constant(opts.deckBRoleId)
        : fc.nat(),
    deadline:
      opts && 'deadline' in opts
        ? opts.deadline === null
          ? fc.constant(undefined)
          : fc.constant(opts.deadline)
        : fc.date(),
  })
}
