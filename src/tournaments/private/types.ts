import * as db from '../../gateways/storage'

export type MatchData = db.MatchRecordWithPodId

export type ParticipantData = db.ParticipantWithUserData

export type TournamentData = db.TournamentRecord

export interface PlayerRecord {
  participantId: number
  dropped: boolean
  wins: number
  losses: number
}

export type ExtendedParticipant = Pick<
  ParticipantData,
  | 'id'
  | 'userId'
  | 'clanId'
  | 'dropped'
  | 'discordId'
  | 'discordDiscriminator'
  | 'discordAvatar'
  | 'discordName'
  | 'bracket'
  | 'timezoneId'
  | 'timezonePreferenceId'
> &
  Pick<PlayerRecord, 'wins' | 'losses'>

export type RankedParticipant = ExtendedParticipant & { position: number }

export interface PodResult extends db.TournamentPodRecord {
  matches: MatchData[]
  participants: RankedParticipant[]
}

export interface PodData {
  id: number
  name: string
  tournamentId: number
  timezoneId: number
}
