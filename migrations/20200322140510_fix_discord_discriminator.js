exports.up = function(knex) {
  return knex.schema.raw(
    `ALTER TABLE users ALTER COLUMN "discordDiscriminator" TYPE CHAR(4) USING to_char("discordDiscriminator", 'fm0000')`
  )
}

exports.down = function(knex) {
  return knex.schema.raw(
    `ALTER TABLE users ALTER COLUMN "discordDiscriminator" TYPE INT USING "discordDiscriminator"::integer`
  )
}
