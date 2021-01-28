
exports.up = function(knex) {
   return knex.schema.createTable('brackets', function(table) {
      table.increments('id').primary()
      table.integer('tournamentId').notNullable().index()
      table.foreign('tournamentId').references('tournaments.id')
      table.string('bracket').notNullable()
      table.foreign('bracket').references('participant_brackets.id')
      table.string('challongeTournamentId').notNullable()
      table.string('url').notNullable()
    })

};

exports.down = function(knex) {
  return knex.schema.dropTable('brackets')
};
