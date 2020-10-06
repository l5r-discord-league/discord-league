import knex, { RawBinding } from 'knex'

import env from '../../../env'

export const pg = knex({
  client: 'pg',
  connection: env.nodeEnv === 'development' ? env.databaseUrl : `${env.databaseUrl}?ssl=true`,
  migrations: {
    tableName: 'knex_migrations',
  },
})

export function query(strings: TemplateStringsArray, ...bindings: RawBinding[]) {
  return pg.raw(strings.join('?'), bindings)
}
