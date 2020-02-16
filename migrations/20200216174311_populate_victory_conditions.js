exports.up = function(knex) {
  return knex('victory_conditions').insert([
    { name: 'Provinces' },
    { name: 'Honor' },
    { name: 'Dishonor' },
    { name: 'Concession' },
    { name: 'W.O.' },
    { name: 'Enlightenment' },
  ])
}

exports.down = function(knex) {
  return knex('victory_conditions')
    .whereIn('name', ['Provinces', 'Honor', 'Dishonor', 'Concession', 'W.O.', 'Enlightenment'])
    .delete()
}
