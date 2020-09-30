exports.up = function(knex) {
  return knex.schema.createTable('decklists', function(table) {
    table.integer('participantId').primary()
    table.foreign('participantId').references('participants.id')
    table.string('link').notNullable()
    table.text('decklist').notNullable()
    table.boolean('locked').notNullable()
    table.timestamps(true, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('decklists')
}
