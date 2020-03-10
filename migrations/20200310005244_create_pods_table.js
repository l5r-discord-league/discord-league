exports.up = function(knex) {
  return knex.schema.createTable('tournament_pods', function(table) {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.integer('tournamentId').notNullable()
    table.foreign('tournamentId').references('tournaments.id')
    table.integer('timezoneId').notNullable()
    table.foreign('timezoneId').references('timezones.id')
    table.specificType('matchIds', 'integer[]').notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('tournament_pods')
}
