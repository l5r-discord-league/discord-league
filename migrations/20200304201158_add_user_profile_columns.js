
exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.string('preferedClan')
    table.string('jigokuName')
  })
};

exports.down = function(knex) {
  knex.schema.table('users', table => {
    table.dropColumn('preferedClan')
    table.dropColumn('jigokuName')
  })
};
