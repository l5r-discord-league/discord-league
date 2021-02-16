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

export interface Pod$findById {
  request: { params: { podId: string } }
  response: PodResult
}
