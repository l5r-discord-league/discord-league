import { pg } from './pg'
import { UserRecord, TABLE as USERS } from './user'
import { TABLE as MATCHES } from './match'
import { fetchWO } from './victoryConditions'

export const TABLE = 'participants'

export interface ParticipantRecord {
  id: number
  userId: string
  clanId: number
  tournamentId: number
  timezoneId: number
  timezonePreferenceId: 'similar' | 'neutral' | 'dissimilar'
  dropped: boolean
  bracket: 'silverCup' | 'goldCup' | null
}

export type ParticipantWithUserData = ParticipantRecord &
  Pick<UserRecord, 'discordAvatar' | 'discordDiscriminator' | 'discordId' | 'discordName'>

const participantWithUserDataColumns = [
  `${TABLE}.id as id`,
  `${TABLE}.userId as userId`,
  `${TABLE}.clanId as clanId`,
  `${TABLE}.tournamentId as tournamentId`,
  `${TABLE}.timezoneId as timezoneId`,
  `${TABLE}.timezonePreferenceId as timezonePreferenceId`,
  `${TABLE}.dropped as dropped`,
  `${TABLE}.bracket as bracket`,
  `${USERS}.discordId as discordId`,
  `${USERS}.discordName as discordName`,
  `${USERS}.discordAvatar as discordAvatar`,
  `${USERS}.discordDiscriminator as discordDiscriminator`,
]

export async function fetchParticipants(tournamentId: number): Promise<ParticipantRecord[]> {
  return pg(TABLE).where('tournamentId', tournamentId)
}

export async function fetchParticipant(
  participantId: number
): Promise<ParticipantRecord | undefined> {
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
  participant: Pick<
    ParticipantRecord,
    'id' | 'userId' | 'clanId' | 'timezoneId' | 'timezonePreferenceId'
  >
): Promise<ParticipantRecord> {
  const result = await pg(TABLE)
    .where('id', participant.id)
    .update({ ...participant }, '*')
  return result[0]
}

export async function updateParticipants(
  ids: ParticipantRecord['id'][],
  update: Partial<
    Pick<
      ParticipantRecord,
      'clanId' | 'timezoneId' | 'timezonePreferenceId' | 'dropped' | 'bracket'
    >
  >
): Promise<ParticipantRecord[]> {
  return pg(TABLE)
    .whereIn('id', ids)
    .update(update, '*')
}

export async function insertParticipant(
  participant: Pick<
    ParticipantRecord,
    'userId' | 'clanId' | 'tournamentId' | 'timezoneId' | 'timezonePreferenceId'
  >
): Promise<ParticipantRecord> {
  return pg(TABLE)
    .insert(participant, '*')
    .then(([row]) => row)
}

export async function deleteParticipant(id: number): Promise<void> {
  return pg(TABLE)
    .where('id', id)
    .del()
    .then(() => undefined)
}

export async function dropParticipant(id: number): Promise<void> {
  const wo = await fetchWO()
  return pg.transaction(async function(trx) {
    await trx(TABLE)
      .update({ dropped: true })
      .where('id', id)

    await trx.raw(
      `UPDATE ${MATCHES}
       SET "victoryConditionId" = :woId , "winnerId" = "playerBId", "updatedAt" = NOW()
       WHERE "playerAId" = :participantId AND "winnerId" IS NULL`,
      { woId: wo.id, participantId: id }
    )

    await trx.raw(
      `UPDATE ${MATCHES}
       SET "victoryConditionId" = :woId , "winnerId" = "playerAId", "updatedAt" = NOW()
       WHERE "playerBId" = :participantId AND "winnerId" IS NULL`,
      { woId: wo.id, participantId: id }
    )
  })
}
