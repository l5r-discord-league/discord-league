export type WithParsedDates<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? Date : T[P]
}

export interface Bracket {
  id: number
  tournamentId: number
  bracket: 'silverCup' | 'goldCup'
  challongeTournamentId: number
  url: string
}

export interface Decklist {
  bracket: 'silverCup' | 'goldCup' | null
  clanId: number
  decklist: string
  discordAvatar: string
  discordId: string
  discordName: string
  link: string
  locked: boolean
  participantId: number
}

export interface Tournament {
  id: number
  name: string
  startDate: string
  statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
  typeId: 'monthly' | 'pod6'
  description?: string
}
export interface Participant {
  id: number
  userId: string
  clanId: number
  dropped: boolean
  discordAvatar: string
  discordId: string
  discordName: string
  timezoneId: number
  bracket: 'silverCup' | 'goldCup' | null
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  wins: number
  losses: number
  position: number
}

export interface ParticipantWithUserData {
  id: number
  userId: string
  clanId: number
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  discordAvatar: string
  discordId: string
  discordName: string
  discordTag: string
  dropped: boolean
  bracket: 'silverCup' | 'goldCup' | null
}

export interface MatchData {
  id: number
  podId: number
  createdAt: Date
  updatedAt: Date
  playerAId: number
  playerBId: number
  winnerId?: number
  firstPlayerId?: number
  victoryConditionId?: number
  deckAClanId?: number
  deckARoleId?: number
  deckASplashId?: number
  deckBClanId?: number
  deckBRoleId?: number
  deckBSplashId?: number
  deadline?: Date
}

export type ShortMatchData = Omit<MatchData, 'podId'>

export interface ExtendedMatch {
  id: number
  createdAt: Date
  updatedAt: Date
  playerAId: number
  playerBId: number
  winnerId?: number
  firstPlayerId?: number
  victoryConditionId?: number
  deckAClanId?: number
  deckARoleId?: number
  deckASplashId?: number
  deckBClanId?: number
  deckBRoleId?: number
  deckBSplashId?: number
  deadline?: Date
  participantA: ParticipantWithUserData
  participantB: ParticipantWithUserData
}

export interface RankedParticipant {
  bracket: 'silverCup' | 'goldCup' | null
  clanId: number
  discordAvatar: string
  discordId: string
  discordName: string
  discordTag: string
  dropped: boolean
  id: number
  losses: number
  position: number
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  userId: string
  wins: number
}

export interface PodResult {
  id: number
  name: string
  tournamentId: number
  timezoneId: number

  matches: MatchData[]
  participants: RankedParticipant[]
}

export interface User {
  discordId: string
  jigokuName?: string
  permissions: number
  preferredClanId?: number
  displayAvatarURL: string
  tag: string
}

export interface UserRowData {
  user: {
    discordId: string
    discordName: string
    discordAvatar: string
    permissions: number
    preferredClanId?: number
    jigokuName?: string
  }
  discordName: string
  jigokuName: string
  preferredClan: string
  userId: string
  role: string
}

export interface Pod$findById {
  request: { params: { podId: string } }
  response: PodResult
}

export interface User$findById {
  request: { params: { userId: string } }
  response: User
}

export interface User$findMatches {
  request: { params: { userId: string } }
  response: Array<{
    tournament: Tournament
    matchesDone: ExtendedMatch[]
    matchesToPlay: ExtendedMatch[]
  }>
}

export interface User$findCurrent {
  response: User
}

export interface User$patchById {
  request: {
    params: { userId: string }
    body: Partial<{ permissions: number; preferredClanId: number; jigokuName: string }>
  }
  response: User
}

export interface User$findAll {
  response: UserRowData[]
}

export interface Match$updateReport {
  request: {
    params: { matchId: string }
    body: {
      id: number
      winnerId: number
      victoryConditionId: number
      firstPlayerId?: number
      deckARoleId?: number
      deckBRoleId?: number
      deckASplashId?: number
      deckBSplashId?: number
    }
  }
  response: undefined
}

export interface Participant$drop {
  request: {
    params: { participantId: string }
  }
  response: void
}

export interface Decklist$findAllForTournament {
  request: {
    params: { tournamentId: string }
  }
  response: Decklist[]
}

export interface Decklist$createForParticipant {
  request: {
    params: { participantId: string }
    body: { link: string; decklist: string }
  }
  response: void
}

export interface Decklist$updateForParticipant {
  request: {
    params: { participantId: string }
    body: { link: string; decklist: string }
  }
  response: void
}

export interface Tournament$findAll {
  response: {
    upcoming: Tournament[]
    ongoing: Tournament[]
    past: Tournament[]
  }
}

export interface Tournament$updateById {
  request: {
    params: { tournamentId: string }
    body: Omit<Tournament, 'id'>
  }
  response: void
}

export interface Tournament$deleteById {
  request: {
    params: { tournamentId: string }
  }
  response: void
}

export interface Tournament$generatePods {
  request: {
    params: { tournamentId: string }
    body: { deadline: string }
  }
  response: void
}

export interface Tournament$findById {
  request: { params: { tournamentId: string } }
  response: {
    tournament: Tournament
    pods: PodResult[]
    brackets: Bracket[]
    participants: RankedParticipant[]
  }
}

export interface Tournament$findStatistics {
  request: { params: { tournamentId: string } }
  response: {
    ranking: [clanId: number, kamiPower: number][]
  }
}
