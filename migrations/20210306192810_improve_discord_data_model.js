exports.up = function(knex) {
  return knex.schema.raw(`
  ALTER TABLE users
    ADD COLUMN "displayTag" VARCHAR NOT NULL DEFAULT 'user#0000',
    ADD COLUMN "displayAvatarURL" VARCHAR NOT NULL DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png';
  UPDATE users
    SET "displayTag" = concat("discordName",'#',"discordDiscriminator"),
      "displayAvatarURL" = concat('https://cdn.discordapp.com/avatars/', "discordId", '/', "discordAvatar", '.webp ');
  `)
};

exports.down = function(knex) {
  return knex.schema.raw(`
  ALTER TABLE users
    DROP COLUMN "displayTag",
    DROP COLUMN "displayAvatarURL"
  `)
};
