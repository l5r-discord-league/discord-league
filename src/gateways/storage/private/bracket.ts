import { pg } from './pg'

export const TABLE = 'pods'

export interface BracketRecord {
  id: number
  tournamentId: number
  bracket: 'silverCup' | 'goldCup'
  challongeTournamentId: number
  url: string
}

export async function createBracket(bracket: Omit<BracketRecord, 'id'>): Promise<BracketRecord> {
  return pg('brackets')
    .insert(bracket, '*')
    .then(([row]) => row)
}
