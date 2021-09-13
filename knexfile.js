/* eslint-disable @typescript-eslint/no-var-requires */
const url = require('url')
const dotenv = require('dotenv')

dotenv.config()

const {
  username: user,
  password,
  hostname: host,
  port,
  pathname,
} = new url.URL(process.env.DATABASE_URL)
const database = pathname.slice(1)

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
        rejectUnauthorized: false,
      },
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
