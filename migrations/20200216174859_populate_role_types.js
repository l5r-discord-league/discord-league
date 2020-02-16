exports.up = function(knex) {
  return knex('role_types').insert([{ name: 'Keeper' }, { name: 'Seeker' }, { name: 'Support of' }])
}

exports.down = function(knex) {
  return knex('role_types')
    .whereIn('name', ['Keeper', 'Seeker', 'Support of'])
    .delete()
}
