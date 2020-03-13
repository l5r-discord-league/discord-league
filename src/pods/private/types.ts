import { ParticipantRecord } from '../../gateways/storage'

export interface Pod {
  timezoneId: number
  participants: ParticipantRecord[]
}
