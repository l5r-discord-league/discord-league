import { pg } from './pg'
import { UserRecord, TABLE as USERS } from './user'

export const TABLE = 'participants'

export interface ParticipantRecord {
  id: number
  userId: string
  clanId: number
  tournamentId: number
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
}

export type ParticipantWithUserData = ParticipantRecord &
  Pick<UserRecord, 'discordName' | 'discordAvatar' | 'discordDiscriminator'>

const participantWithUserDataColumns = [
  `${TABLE}.id as id`,
  `${TABLE}.userId as userId`,
  `${TABLE}.clanId as clanId`,
  `${TABLE}.tournamentId as tournamentId`,
  `${TABLE}.timezoneId as timezoneId`,
  `${TABLE}.timezonePreferenceId as timezonePreferenceId`,
  `${USERS}.discordName as discordName`,
  `${USERS}.discordAvatar as discordAvatar`,
  `${USERS}.discordDiscriminator as discordDiscriminator`,
]

export async function fetchParticipants(tournamentId: number): Promise<ParticipantRecord[]> {
  return pg(TABLE).where('tournamentId', tournamentId)
}

export async function fetchParticipant(participantId: number): Promise<ParticipantRecord> {
  return pg(TABLE)
    .where('id', participantId)
    .first()
}

export async function fetchParticipantsForUser(userId: string): Promise<ParticipantRecord[]> {
  return pg(TABLE).where('userId', userId)
}

export async function fetchParticipantsWithUserData(
  tournamentId: number
): Promise<ParticipantWithUserData[]> {
  return pg(TABLE)
    .where('tournamentId', tournamentId)
    .join(USERS, `${TABLE}.userId`, `${USERS}.discordId`)
    .select(participantWithUserDataColumns)
}

export async function fetchParticipantWithUserData(
  participantId: number
): Promise<ParticipantWithUserData> {
  return pg(TABLE)
    .where('id', participantId)
    .join(USERS, `${TABLE}.userId`, `${USERS}.discordId`)
    .select(participantWithUserDataColumns)
    .first()
}

export async function fetchMultipleParticipantsWithUserData(
  participantIds: number[]
): Promise<ParticipantWithUserData[]> {
  return pg(TABLE)
    .whereIn('id', participantIds)
    .join(USERS, `${TABLE}.userId`, `${USERS}.discordId`)
    .select(participantWithUserDataColumns)
}

export async function updateParticipant(
  participant: Omit<ParticipantRecord, 'createdAt' | 'updatedAt' | 'tournamentId'>
): Promise<ParticipantRecord> {
  const result = await pg(TABLE)
    .where('id', participant.id)
    .update({ ...participant }, '*')
  return result[0]
}

export async function insertParticipant(
  participant: Omit<ParticipantRecord, 'id'>
): Promise<ParticipantRecord> {
  return pg(TABLE)
    .insert(participant, '*')
    .then(([row]) => row)
}

export async function deleteParticipant(id: number): Promise<ParticipantRecord> {
  return pg(TABLE)
    .where('id', id)
    .del()
}
