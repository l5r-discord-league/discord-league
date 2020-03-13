import { ParticipantRecord } from '../../gateways/storage'

export type Participant = ParticipantRecord

export interface Cohort {
  tz: number
  fixed: Participant[]
  fluid: Participant[]
}
export interface Pod {
  timezoneId: number
  participants: Participant[]
}
