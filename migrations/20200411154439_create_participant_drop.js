exports.up = function(knex) {
  return knex.schema.alterTable('participants', function(table) {
    table
      .boolean('dropped')
      .notNullable()
      .defaultTo(false)
  })
}

exports.down = function(knex) {
  return knex.schema.table('participants', table => {
    table.dropColumn('dropped')
  })
}
