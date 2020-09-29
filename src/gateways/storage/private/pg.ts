import knex from 'knex'

import env from '../../../env'

export const pg = knex({
  client: 'pg',
  connection: env.databaseUrl,
  migrations: {
    tableName: 'knex_migrations',
  },
})
