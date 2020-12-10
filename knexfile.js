/* eslint-disable */
const dotenv = require('dotenv')

dotenv.config()

const [,user, password, host, port, database] = (/^postgres:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)$/).exec(process.env.DATABASE_URL)

module.exports = {
  development: {
    client: 'pg',
    connection: {
      user,
      password,
      host,
      port: parseInt(port, 10),
      database,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      user,
      password,
      host,
      port: parseInt(port, 10),
      database,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
