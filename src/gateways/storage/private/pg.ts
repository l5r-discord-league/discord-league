import knex, { RawBinding } from 'knex'

import env from '../../../env'

export const pg = knex({
  client: 'pg',
  connection: {
    connectString: env.databaseUrl,
    ssl: env.nodeEnv === 'development' ? false : { rejectUnauthorized: false },
  },
  migrations: {
    tableName: 'knex_migrations',
  },
})

export function query(strings: TemplateStringsArray, ...bindings: RawBinding[]) {
  return pg.raw(strings.join('?'), bindings)
}
