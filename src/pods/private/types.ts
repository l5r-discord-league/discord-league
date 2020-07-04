import { ParticipantRecord } from '../../gateways/storage'

export type Player = ParticipantRecord

export interface Pod {
  timezones: number[]
  players: Player[]
}
