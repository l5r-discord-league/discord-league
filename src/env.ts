import dotenv from 'dotenv'

dotenv.config()

export default {
  discordClientId: String(process.env.DISCORD_CLIENT_ID),
  discordClientSecret: String(process.env.DISCORD_CLIENT_SECRET),
  jwtSecret: String(process.env.JWT_SECRET),
  serverPort: parseInt(String(process.env.PORT), 10),
}
