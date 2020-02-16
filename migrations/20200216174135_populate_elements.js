exports.up = function(knex) {
  return knex('elements').insert([
    { name: 'Air' },
    { name: 'Earth' },
    { name: 'Fire' },
    { name: 'Void' },
    { name: 'Water' },
  ])
}

exports.down = function(knex) {
  return knex('elements')
    .whereIn('name', ['Air', 'Earth', 'Fire', 'Void', 'Water'])
    .delete()
}
