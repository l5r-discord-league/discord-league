import { pg } from './pg'
import { UserRecord } from './user'

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
  Pick<UserRecord, 'discordAvatar' | 'discordId' | 'discordName'> & {
    discordTag: string
  }

export async function fetchParticipant(
  participantId: number
): Promise<ParticipantRecord | undefined> {
  return pg(TABLE).where('id', participantId).first()
}

export async function fetchParticipants(tournamentId: number): Promise<ParticipantWithUserData[]> {
  return pg
    .raw(
      `
      SELECT
        p."id" as "id",
        p."userId" as "userId",
        p."clanId" as "clanId",
        p."tournamentId" as "tournamentId",
        p."timezoneId" as "timezoneId",
        p."timezonePreferenceId" as "timezonePreferenceId",
        p."dropped" as "dropped",
        p."bracket" as "bracket",
        u."discordId" as "discordId",
        u."discordName" as "discordName",
        u."discordAvatar" as "discordAvatar",
        CONCAT(u."discordName", '#', u."discordDiscriminator") as "discordTag"
      FROM "participants" as p
      INNER JOIN "users" as u ON u."discordId" = p."userId"
      WHERE
        p."tournamentId" = :tournamentId
  `,
      { tournamentId }
    )
    .then(({ rows }) => rows)
}

export async function fetchParticipantsForUser(userId: string): Promise<ParticipantRecord[]> {
  return pg
    .raw(
      `
      SELECT *
      FROM "participants" AS p
      WHERE p."userId" = :userId
  `,
      { userId }
    )
    .then(({ rows }) => rows)
}

export async function fetchParticipantWithUserData(
  participantId: number
): Promise<ParticipantWithUserData> {
  return pg
    .raw(
      `
      SELECT
        p."id" as "id",
        p."userId" as "userId",
        p."clanId" as "clanId",
        p."tournamentId" as "tournamentId",
        p."timezoneId" as "timezoneId",
        p."timezonePreferenceId" as "timezonePreferenceId",
        p."dropped" as "dropped",
        p."bracket" as "bracket",
        u."discordId" as "discordId",
        u."discordName" as "discordName",
        u."discordAvatar" as "discordAvatar",
        CONCAT(u."discordName", '#', u."discordDiscriminator") as "discordTag"
      FROM "participants" as p
      INNER JOIN "users" as u ON u."discordId" = p."userId"
      WHERE
        p."id" = :participantId
      LIMIT 1
  `,
      { participantId }
    )
    .then(({ rows }) => rows[0])
}

export async function fetchMultipleParticipantsWithUserData(
  participantIds: number[]
): Promise<ParticipantWithUserData[]> {
  return pg
    .raw(
      `
      SELECT
        p."id" as "id",
        p."userId" as "userId",
        p."clanId" as "clanId",
        p."tournamentId" as "tournamentId",
        p."timezoneId" as "timezoneId",
        p."timezonePreferenceId" as "timezonePreferenceId",
        p."dropped" as "dropped",
        p."bracket" as "bracket",
        u."discordId" as "discordId",
        u."discordName" as "discordName",
        u."discordAvatar" as "discordAvatar",
        CONCAT(u."discordName", '#', u."discordDiscriminator") as "discordTag"
      FROM "participants" as p
      INNER JOIN "users" as u ON u."discordId" = p."userId"
      WHERE
        p."id" IN(:participantIds)
  `,
      { participantIds: pg.raw(participantIds) }
    )
    .then(({ rows }) => rows)
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
  return pg(TABLE).whereIn('id', ids).update(update, '*')
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

export async function dropParticipant(id: number): Promise<number> {
  return pg(TABLE).update({ dropped: true }).where('id', id)
}
