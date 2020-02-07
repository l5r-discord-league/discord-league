import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('clans', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable()
    })
    .createTable('win_conditions', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable()
    })
    .createTable('role_types', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable()
    })
    .createTable('elements', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable()
    })
    .createTable('roles', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.integer('role_type_id')
      table.foreign('role_type_id').references('role_types.id')
      table.integer('element_id')
      table.foreign('element_id').references('elements.id')
    })
    .createTable('matches', function(table) {
      table.increments('id').primary()
      table.integer('player_a_id')
      table.integer('player_b_id')
      table.integer('winner_id')
      table.integer('first_player_id')
      table.integer('win_condition_id')
      table.foreign('win_condition_id').references('win_conditions.id')
      table.integer('deck_a_clan_id')
      table.foreign('deck_a_clan_id').references('clans.id')
      table.integer('deck_a_role_id')
      table.foreign('deck_a_role_id').references('roles.id')
      table.integer('deck_a_splash_id')
      table.integer('deck_b_clan_id')
      table.foreign('deck_b_clan_id').references('clans.id')
      table.integer('deck_b_role_id')
      table.foreign('deck_b_role_id').references('roles.id')
      table.integer('deck_b_splash_id')
      table.dateTime('deadline')
      table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('matches')
}
