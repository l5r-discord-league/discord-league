import knex from 'knex'

import env from '../../../env'

const extractDatabaseCnfig = /^postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/

export const pg = knex({
  client: 'pg',
  connection() {
    const connectionParts = extractDatabaseCnfig.exec(env.databaseUrl)
    if (connectionParts === null) {
      throw Error('Bad database URL')
    }
    const [, user, password, host, port, database] = connectionParts
    return {
      host,
      user,
      password,
      database,
      port: parseInt(port, 10),
      ssl: env.nodeEnv === 'production',
      rejectUnauthorized: false,
    }
  },
  migrations: {
    tableName: 'knex_migrations',
  },
})
