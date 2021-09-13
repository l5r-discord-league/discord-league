import { DatabaseError } from 'pg'

export function isDbError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError
}
