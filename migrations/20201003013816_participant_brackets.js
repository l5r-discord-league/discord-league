exports.up = function(knex) {
  return knex.schema
    .createTable('participant_brackets', function(table) {
      table.string('id').primary()
      table.string('name').notNullable()
    })
    .alterTable('participants', function(table) {
      table.string('bracket')
      table.foreign('bracket').references('participant_brackets.id')
    })
    .then(() =>
      knex('participant_brackets').insert([
        { id: 'silverCup', name: 'Silver Cup' },
        { id: 'goldCup', name: 'Gold Cup' },
      ])
    )
}

exports.down = function(knex) {
  return knex.schema
    .alterTable('participants', function(table) {
      table.dropColumn('bracket')
    })
    .dropTable('participant_brackets')
}
