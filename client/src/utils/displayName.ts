export function displayName({
  discordName,
  discordDiscriminator,
}: {
  discordName: string
  discordDiscriminator: string
}) {
  return `${discordName}#${discordDiscriminator}`
}
