/* eslint-disable */
const dotenv = require('dotenv')

dotenv.config()

const extractDatabaseCnfig = /^postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/

const connectionParts = extractDatabaseCnfig.exec(env.databaseUrl)
if (connectionParts === null) {
  throw Error('Bad database URL')
}
const [, user, password, host, port, database] = connectionParts
const connection = {
  host,
  user,
  password,
  database,
  port: parseInt(port, 10),
  ssl: process.env.NODE_ENV === 'production',
}

module.exports = {
  development: {
    client: 'pg',
    connection,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
