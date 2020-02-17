exports.up = function(knex) {
  return knex('roles')
    .where({ name: 'Keeper of the Void' })
    .update({ name: 'Keeper of Void' })
    .then(() =>
      knex('roles')
        .where({ name: 'Seeker of the Void' })
        .update({ name: 'Seeker of Void' })
    )
}

exports.down = function(knex) {
  return knex('roles')
    .where({ name: 'Keeper of Void' })
    .update({ name: 'Keeper of the Void' })
    .then(() =>
      knex('roles')
        .where({ name: 'Seeker of Void' })
        .update({ name: 'Seeker of the Void' })
    )
}
