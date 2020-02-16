exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.string('discord_id').primary()
    table.string('discord_access_token')
    table.string('discord_refresh_token')
    /**
     * For permissions we can start with 0 for player and 1 for admin. If we end up needing a more
     * complex system we can scale these permissions to use bitmask
     * @see https://abdulapopoola.com/2016/05/30/understanding-bit-masks/
     */
    table.integer('permissions').unsigned()
    table.index('permissions')
    table.timestamps(false, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
