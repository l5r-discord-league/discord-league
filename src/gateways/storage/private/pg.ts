import url from 'url'
import knex, { RawBinding } from 'knex'

import env from '../../../env'

const { username: user, password, hostname: host, port, pathname } = new url.URL(env.databaseUrl)
const database = pathname.slice(1)

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function query(strings: TemplateStringsArray, ...bindings: RawBinding[]): knex.Raw<any> {
  return pg.raw(strings.join('?'), bindings)
}
