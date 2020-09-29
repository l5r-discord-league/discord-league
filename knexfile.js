/* eslint-disable */
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}`,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
