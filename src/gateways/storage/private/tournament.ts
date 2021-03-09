import { pg } from './pg'

export const TABLE = 'tournaments'

export interface TournamentRecord {
  id: number
  name: string
  startDate: Date
  statusId: 'upcoming' | 'group' | 'endOfGroup' | 'bracket' | 'finished'
  typeId: 'monthly' | 'pod6'
  description?: string
  createdAt: Date
  updatedAt: Date
}

export async function getTournament(id: number): Promise<TournamentRecord | undefined> {
  return pg(TABLE).select('*').where('id', id).first()
}

export async function createTournament(
  tournament: Omit<TournamentRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TournamentRecord> {
  return pg(TABLE)
    .insert(tournament, '*')
    .then(([row]) => row)
}

export async function deleteTournament(id: number): Promise<number> {
  return pg(TABLE).where('id', id).del()
}

export async function updateTournament(
  id: number,
  tournament: Partial<Omit<TournamentRecord, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<TournamentRecord> {
  const result = await pg(TABLE)
    .where('id', id)
    .update({ ...tournament, updatedAt: new Date() }, '*')
  return result[0]
}

export async function getAllTournaments(): Promise<
  Array<Pick<TournamentRecord, 'id' | 'name' | 'startDate' | 'statusId' | 'typeId' | 'description'>>
> {
  return pg
    .raw(
      `
          SELECT
            "id",
            "name",
            "startDate",
            "statusId",
            "typeId",
            "description"
          FROM
            tournaments
          ORDER BY
            "startDate" DESC
      `
    )
    .then(({ rows }) => rows)
}

export async function fetchTournaments(tournamentIds: number[]): Promise<TournamentRecord[]> {
  return pg(TABLE).whereIn('id', tournamentIds)
}

export async function fetchTournament(id: number): Promise<TournamentRecord | undefined> {
  return pg(TABLE).where('id', id).first()
}
