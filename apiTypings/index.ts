export interface Tournament {
  id: number
  name: string
  startDate: string
  statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
  typeId: 'monthly' | 'pod6'
  description?: string
  createdAt: string
  updatedAt: string
}

export interface ParticipantWithUserData {
  id: number
  userId: string
  clanId: number
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  discordAvatar: string
  discordDiscriminator: string
  discordId: string
  discordName: string
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

export interface RankedParticipant {
  bracket: 'silverCup' | 'goldCup' | null
  clanId: number
  discordAvatar: string
  discordDiscriminator: string
  discordId: string
  discordName: string
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
    matches: ShortMatchData[]
    participants: ParticipantWithUserData[]
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
