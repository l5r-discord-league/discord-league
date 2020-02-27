exports.up = function(knex) {
  return knex.schema
    .alterTable('users', function(table) {
      table.renameColumn('discord_id', 'discordId')
      table.renameColumn('discord_access_token', 'discordAccessToken')
      table.renameColumn('discord_refresh_token', 'discordRefreshToken')
      table.renameColumn('discord_name', 'discordName')
      table.renameColumn('discord_avatar', 'discordAvatar')
      table.renameColumn('discord_discriminator', 'discordDiscriminator')
      table.renameColumn('created_at', 'createdAt')
      table.renameColumn('updated_at', 'updatedAt')
    })
    .alterTable('roles', function(table) {
      table.renameColumn('role_type_id', 'roleTypeId')
      table.renameColumn('element_id', 'elementId')
    })
    .alterTable('participants', function(table) {
      table.renameColumn('user_id', 'userId')
      table.renameColumn('clan_id', 'clanId')
    })
    .alterTable('matches', function(table) {
      table.renameColumn('player_a_id', 'playerAId')
      table.renameColumn('player_b_id', 'playerBId')
      table.renameColumn('winner_id', 'winnerId')
      table.renameColumn('first_player_id', 'firstPlayerId')
      table.renameColumn('victory_condition_id', 'victoryConditionId')
      table.renameColumn('deck_a_clan_id', 'deckAClanId')
      table.renameColumn('deck_a_role_id', 'deckARoleId')
      table.renameColumn('deck_a_splash_id', 'deckASplashId')
      table.renameColumn('deck_b_clan_id', 'deckBClanId')
      table.renameColumn('deck_b_role_id', 'deckBRoleId')
      table.renameColumn('deck_b_splash_id', 'deckBSplashId')
      table.renameColumn('created_at', 'createdAt')
      table.renameColumn('updated_at', 'updatedAt')
    })
    .alterTable('tournaments', function(table) {
      table.renameColumn('start_date', 'startDate')
      table.renameColumn('status_id', 'statusId')
      table.renameColumn('type_id', 'typeId')
      table.renameColumn('created_at', 'createdAt')
      table.renameColumn('updated_at', 'updatedAt')
    })
}

exports.down = function(knex) {
  return knex.schema
    .alterTable('users', function(table) {
      table.renameColumn('discordId', 'discord_id')
      table.renameColumn('discordAccessToken', 'discord_access_token')
      table.renameColumn('discordRefreshToken', 'discord_refresh_token')
      table.renameColumn('discordName', 'discord_name')
      table.renameColumn('discordAvatar', 'discord_avatar')
      table.renameColumn('discordDiscriminator', 'discord_discriminator')
      table.renameColumn('createdAt', 'created_at')
      table.renameColumn('updatedAt', 'updated_at')
    })
    .alterTable('roles', function(table) {
      table.renameColumn('roleTypeId', 'role_type_id')
      table.renameColumn('elementId', 'element_id')
    })
    .alterTable('participants', function(table) {
      table.renameColumn('userId', 'user_id')
      table.renameColumn('clanId', 'clan_id')
    })
    .alterTable('matches', function(table) {
      table.renameColumn('playerAId', 'player_a_id')
      table.renameColumn('playerBId', 'player_b_id')
      table.renameColumn('winnerId', 'winner_id')
      table.renameColumn('firstPlayerId', 'first_player_id')
      table.renameColumn('victoryConditionId', 'victory_condition_id')
      table.renameColumn('deckAClanId', 'deck_a_clan_id')
      table.renameColumn('deckARoleId', 'deck_a_role_id')
      table.renameColumn('deckASplashId', 'deck_a_splash_id')
      table.renameColumn('deckBClanId', 'deck_b_clan_id')
      table.renameColumn('deckBRoleId', 'deck_b_role_id')
      table.renameColumn('deckBSplashId', 'deck_b_splash_id')
      table.renameColumn('createdAt', 'created_at')
      table.renameColumn('updatedAt', 'updated_at')
    })
    .alterTable('tournaments', function(table) {
      table.renameColumn('startDate', 'start_date')
      table.renameColumn('statusId', 'status_id')
      table.renameColumn('typeId', 'type_id')
      table.renameColumn('createdAt', 'created_at')
      table.renameColumn('updatedAt', 'updated_at')
    })
}
