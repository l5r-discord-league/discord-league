exports.up = function(knex) {
  return knex.schema
    .createTable('tournament_stati', function(table) {
      table.string('id').primary()
      table.string('name').notNullable()
    })
    .createTable('tournament_types', function(table) {
      table.string('id').primary()
      table.string('name').notNullable()
    })
    .createTable('tournaments', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.text('description')
      table.datetime('start_date')
      table.string('status_id').notNullable()
      table.foreign('status_id').references('tournament_stati.id')
      table.string('type_id').notNullable()
      table.foreign('type_id').references('tournament_types.id')
      table.timestamps(true, true)
    })
    .then(() =>
      knex('tournament_stati').insert([
        { id: 'upcoming', name: 'Upcoming' },
        { id: 'group', name: 'Group Stage' },
        { id: 'endOfGroup', name: 'End of Group Stage' },
        { id: 'bracket', name: 'Bracket Stage' },
        { id: 'finished', name: 'Finished' },
      ])
    )
    .then(() => knex('tournament_types').insert([{ id: 'monthly', name: 'Monthly' }]))
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('tournaments')
    .dropTable('tournament_types')
    .dropTable('tournament_stati')
}
