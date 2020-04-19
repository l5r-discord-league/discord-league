import { ParticipantWithUserData } from '../hooks/useTournamentParticipants'

export function displayName({ discordName, discordDiscriminator }: ParticipantWithUserData) {
  return `${discordName}#${discordDiscriminator}`
}
