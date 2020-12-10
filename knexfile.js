/* eslint-disable */
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectString: process.env.DATABASE_URL,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      connectString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
