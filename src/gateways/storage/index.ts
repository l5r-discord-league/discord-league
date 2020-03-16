import { pg } from './private/pg'

export * from './private/match'

export interface UserRecord {
  discordId: string
  discordName: string
  discordDiscriminator: number
  discordAvatar: string
  discordAccessToken: string
  discordRefreshToken: string
  permissions: number
  preferredClanId?: number
  jigokuName?: string
  createdAt: Date
  updatedAt: Date
}

export type UserReadModel = Omit<
  UserRecord,
  'discordAccessToken' | 'discordRefreshToken' | 'createdAt' | 'updatedAt'
>

const userColumns = [
  'discordId',
  'discordName',
  'discordDiscriminator',
  'discordAvatar',
  'permissions',
  'preferredClanId',
  'jigokuName',
]

export async function getAllUsers(): Promise<UserReadModel[]> {
  return pg('users')
    .column(userColumns)
    .select()
}

export async function getUser(id: string): Promise<UserReadModel> {
  return pg('users')
    .column(userColumns)
    .select()
    .where('discordId', id)
    .first()
}

export async function upsertUser(
  user: Omit<UserRecord, 'permissions' | 'createdAt' | 'updatedAt'>
): Promise<UserRecord> {
  const insert = pg('users').insert({ ...user, permissions: 0 })
  const update = pg.queryBuilder().update({ ...user, updatedAt: new Date() })
  const result = await pg.raw(`? ON CONFLICT ("discordId") DO ? returning *`, [insert, update])
  return result.rows[0]
}

export async function updateUser(user: UserReadModel): Promise<UserReadModel> {
  const result = await pg('users')
    .where({ discordId: user.discordId })
    .update({ ...user, updatedAt: new Date() }, userColumns)
  return result[0]
}

export interface TournamentRecord {
  id: number
  name: string
  startDate: Date
  statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
  typeId: 'monthly'
  description?: string
  createdAt: Date
  updatedAt: Date
}

export async function getTournament(id: string): Promise<TournamentRecord> {
  return pg('tournaments')
    .select('*')
    .where('id', id)
    .first()
}

export async function createTournament(
  tournament: Omit<TournamentRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TournamentRecord> {
  return pg('tournaments')
    .insert(tournament, '*')
    .then(([row]) => row)
}

export async function deleteTournament(id: string): Promise<number> {
  return pg('tournaments')
    .where('id', id)
    .del()
}

export async function updateTournament(
  tournament: Omit<TournamentRecord, 'createdAt' | 'updatedAt'>
): Promise<TournamentRecord> {
  const result = await pg('tournaments')
    .where('id', tournament.id)
    .update({ ...tournament, updatedAt: new Date() }, '*')
  return result[0]
}

export async function getAllTournaments(): Promise<TournamentRecord[]> {
  return pg('tournaments').select('*')
}

export async function fetchTournament(id: number): Promise<TournamentRecord | undefined> {
  return pg('tournaments')
    .where('id', id)
    .first()
}

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
  'participants.id as id',
  'participants.userId as userId',
  'participants.clanId as clanId',
  'participants.tournamentId as tournamentId',
  'participants.timezoneId as timezoneId',
  'participants.timezonePreferenceId as timezonePreferenceId',
  'users.discordName as discordName',
  'users.discordAvatar as discordAvatar',
  'users.discordDiscriminator as discordDiscriminator',
]

export async function fetchTournamentParticipants(
  tournamentId: number
): Promise<ParticipantRecord[]> {
  return pg('participants').where('tournamentId', tournamentId)
}

export async function fetchTournamentParticipant(
  participantId: number
): Promise<ParticipantRecord> {
  return pg('participants')
    .where('id', participantId)
    .first()
}

export async function fetchTournamentParticipantsWithUserData(
  tournamentId: number
): Promise<ParticipantWithUserData[]> {
  return pg('participants')
    .where('tournamentId', tournamentId)
    .join('users', 'participants.userId', 'users.discordId')
    .select(participantWithUserDataColumns)
}

export async function updateParticipant(
  participant: Omit<ParticipantRecord, 'createdAt' | 'updatedAt' | 'tournamentId'>
): Promise<ParticipantRecord> {
  const result = await pg('participants')
    .where('id', participant.id)
    .update({ ...participant }, '*')
  return result[0]
}

export async function insertParticipant(
  participant: Omit<ParticipantRecord, 'id'>
): Promise<ParticipantRecord> {
  return pg('participants')
    .insert(participant, '*')
    .then(([row]) => row)
}

export async function deleteParticipant(id: number): Promise<ParticipantRecord> {
  return pg('participants')
    .where('id', id)
    .del()
}

export interface TournamentPodRecord {
  id: number
  name: string
  tournamentId: number
  timezoneId: number
}

export async function createTournamentPod(
  tournamentPod: Omit<TournamentPodRecord, 'id'>
): Promise<TournamentPodRecord> {
  return pg('pods')
    .insert(tournamentPod, '*')
    .then(([row]) => row)
}
