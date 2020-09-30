exports.up = function(knex) {
  return knex.schema.createTable('decklists', function(table) {
    table.increments('decklistId').primary()
    table.integer('participantId').notNullable()
    table.foreign('participantId').references('participants.id')
    table.string('link').notNullable()
    table.text('decklist').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('decklists')
}
