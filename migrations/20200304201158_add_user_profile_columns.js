
exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.integer('preferredClanId')
    table.foreign('preferredClanId').references('clans.id')
    table.string('jigokuName')
  })
};

exports.down = function(knex) {
  knex.schema.table('users', table => {
    table.dropColumn('preferredClanId')
    table.dropColumn('jigokuName')
  })
};
