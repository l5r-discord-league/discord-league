import { pg } from './pg'

export const TABLE = 'tournaments'

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
  return pg(TABLE)
    .select('*')
    .where('id', id)
    .first()
}

export async function createTournament(
  tournament: Omit<TournamentRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TournamentRecord> {
  return pg(TABLE)
    .insert(tournament, '*')
    .then(([row]) => row)
}

export async function deleteTournament(id: string): Promise<number> {
  return pg(TABLE)
    .where('id', id)
    .del()
}

export async function updateTournament(
  tournament: Omit<TournamentRecord, 'createdAt' | 'updatedAt'>
): Promise<TournamentRecord> {
  const result = await pg(TABLE)
    .where('id', tournament.id)
    .update({ ...tournament, updatedAt: new Date() }, '*')
  return result[0]
}

export async function getAllTournaments(): Promise<TournamentRecord[]> {
  return pg(TABLE).select('*')
}

export async function fetchTournament(id: number): Promise<TournamentRecord | undefined> {
  return pg(TABLE)
    .where('id', id)
    .first()
}