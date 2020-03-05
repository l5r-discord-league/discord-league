exports.up = function(knex) {
  return knex.schema
    .createTable('feedbacks', function(table) {
      table.increments('id').primary()
      table.integer('participantId')
      table.foreign('participantId').references('participants.id')
      table.text('comment')
    })
    .createTable('timezones', function(table) {
      table.increments('id').primary()
      table.string('name')
    })
    .createTable('timezone_preferences', function(table) {
      table.string('id').primary()
      table.string('name').notNullable()
    })
    .alterTable('participants', function(table) {
      table.dropColumn('clanId')
    })
    .alterTable('participants', function(table) {
      table.integer('clanId').notNullable()
      table.foreign('clanId').references('clans.id')
      table.integer('tournamentId').notNullable()
      table.foreign('tournamentId').references('tournaments.id')
      table.integer('timezoneId').notNullable()
      table.foreign('timezoneId').references('timezones.id')
      table.string('timezonePreferenceId').notNullable()
      table.foreign('timezonePreferenceId').references('timezone_preferences.id')
    })
    .then(() =>
      knex('timezones').insert([
        { name: 'UTC-12 to UTC-8' },
        { name: 'UTC-7 to UTC-5' },
        { name: 'UTC-4 to UTC-2' },
        { name: 'UTC-1 to UTC+1' },
        { name: 'UTC+2 to UTC+4' },
        { name: 'UTC+5 to UTC+7' },
        { name: 'UTC+8 to UTC+12' },
      ])
    )
    .then(() =>
      knex('timezone_preferences').insert([
        { id: 'similar', name: 'Yes' },
        { id: 'neutral', name: `Don't care` },
        { id: 'dissimilar', name: 'No' },
      ])
    )
}

exports.down = function(knex) {
  throw Error(
    'This migration cannot be reverted, because the column clanId cannot be reconstructed'
  )
}
