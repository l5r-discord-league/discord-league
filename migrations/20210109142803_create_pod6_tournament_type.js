
exports.up = function(knex) {
  return knex('tournament_types').insert([{ id: 'pod6', name: 'Monthly 2021' }])
};

exports.down = function(knex) {
  return knex('tournament_types')
    .whereIn('id', 'pod6')
    .delete()
};
