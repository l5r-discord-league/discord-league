exports.up = function(knex) {
  return knex('clans').insert([
    { name: 'Crab' },
    { name: 'Crane' },
    { name: 'Dragon' },
    { name: 'Lion' },
    { name: 'Phoenix' },
    { name: 'Scorpion' },
    { name: 'Unicorn' },
  ])
}

exports.down = function(knex) {
  return knex('clans')
    .whereIn('name', ['Crab', 'Crane', 'Dragon', 'Lion', 'Phoenix', 'Scorpion', 'Unicorn'])
    .delete()
}
