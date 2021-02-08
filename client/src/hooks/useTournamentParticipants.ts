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
