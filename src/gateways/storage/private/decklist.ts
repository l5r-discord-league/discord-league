import { pg } from './pg'
import { UserRecord } from './user'
import { ParticipantRecord } from './participant'

export const TABLE = 'decklists'

export interface DecklistRecord {
  participantId: number
  link: string
  decklist: string
  locked: boolean
}

const decklistPublicProps: Array<keyof DecklistRecord> = [
  'participantId',
  'link',
  'decklist',
  'locked',
]

export async function fetchDecklistForParticipant(
  participantId: DecklistRecord['participantId']
): Promise<DecklistRecord | undefined> {
  return pg(TABLE).first(decklistPublicProps).where('participantId', participantId)
}

export async function createDecklist(
  decklist: Pick<DecklistRecord, 'decklist' | 'link' | 'participantId' | 'locked'>
): Promise<DecklistRecord> {
  return pg(TABLE)
    .insert(decklist, decklistPublicProps)
    .then(([row]) => row)
}

export async function updateDecklist(
  participantId: DecklistRecord['participantId'],
  decklist: Partial<Pick<DecklistRecord, 'decklist' | 'link' | 'locked'>>
): Promise<number> {
  return pg(TABLE)
    .update({ ...decklist, updated_at: new Date() })
    .where('participantId', participantId)
}

export async function fetchTournamentDecklists(
  tournamentId: number,
  opts: {
    isAdmin?: boolean
    userDiscordId?: string
  }
): Promise<
  Array<
    Pick<DecklistRecord, 'participantId' | 'link' | 'decklist' | 'locked'> &
      Pick<UserRecord, 'discordId' | 'discordName' | 'discordAvatar'> &
      Pick<ParticipantRecord, 'clanId' | 'bracket'>
  >
> {
  return pg
    .raw(
      `
      SELECT
        u."discordId" as "discordId",
        u."discordName" as "discordName",
        u."discordAvatar" as "discordAvatar",
        p."clanId" as "clanId",
        p."bracket" as "bracket",
        d."participantId" as "participantId",
        d."link" as "link",
        d."decklist" as "decklist",
        d."locked" as "locked"
      FROM participants as p
        INNER JOIN users as u ON p."userId" = u."discordId"
        INNER JOIN decklists as d ON p."id" = d."participantId"
      WHERE p."tournamentId" = :tournamentId
        AND (d."locked" IS TRUE OR u."discordId" = :userDiscordId OR :isAdmin)
  `,
      {
        tournamentId,
        isAdmin: opts.isAdmin ?? false,
        userDiscordId: opts.userDiscordId ?? null,
      }
    )
    .then((response) => response.rows)
}

export async function lockTournamentDecklists(tournamentId: number): Promise<boolean> {
  return pg
    .raw(
      `
      UPDATE "decklists"
        SET "locked" = TRUE
      WHERE "participantId" IN(
        SELECT "id"
        FROM "participants" AS p
        WHERE p."tournamentId" = :tournamentId
      )
  `,
      { tournamentId }
    )
    .then(() => true)
}
