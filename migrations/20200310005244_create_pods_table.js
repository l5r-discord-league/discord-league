exports.up = function(knex) {
  return knex.schema
    .createTable('pods', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable()
      table
        .integer('tournamentId')
        .notNullable()
        .references('tournaments.id')
        .onDelete('CASCADE')
        .index()
      table
        .integer('timezoneId')
        .notNullable()
        .references('timezones.id')
        .onDelete('RESTRICT')
        .index()
    })
    .createTable('pods_matches', function(table) {
      table
        .integer('podId')
        .notNullable()
        .references('pods.id')
        .onDelete('CASCADE')
        .index()
      table
        .integer('matchId')
        .notNullable()
        .references('matches.id')
        .onDelete('CASCADE')
        .index()
    })
}

exports.down = function(knex) {
  return knex.schema.dropTable('pods_matches').dropTable('pods')
}
