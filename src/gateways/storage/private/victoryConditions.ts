import { pg } from './pg'

export const TABLE = 'victory_conditions'

interface VictoryConditionRecord {
  id: number
  name: string
}

export async function fetchWO(): Promise<VictoryConditionRecord> {
  return pg(TABLE)
    .select('*')
    .where('name', 'W.O.')
    .first()
}
