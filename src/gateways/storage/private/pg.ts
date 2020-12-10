import knex, { RawBinding } from 'knex'

import env from '../../../env'

const [, user, password, host, port, database] =
  /^postgres:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)$/.exec(env.databaseUrl) || []

export const pg = knex({
  client: 'pg',
  connection: {
    user,
    password,
    host,
    port: parseInt(port, 10),
    database,
    ssl: env.nodeEnv === 'development' ? false : { rejectUnauthorized: false },
  },
  migrations: {
    tableName: 'knex_migrations',
  },
})

export function query(strings: TemplateStringsArray, ...bindings: RawBinding[]) {
  return pg.raw(strings.join('?'), bindings)
}
