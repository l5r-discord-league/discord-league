
exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.string('discord_name')
    table.string('discord_avatar')
    table.integer('discord_discriminator')
  })
};

exports.down = function(knex) {
  knex.schema.table('users', table => {
    table.dropColumn('discord_name')
    table.dropColumn('discord_avatar')
    table.dropColumn('discord_discriminator')
  })
};
