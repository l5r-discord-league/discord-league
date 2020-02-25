import dotenv from 'dotenv'

dotenv.config()

export default {
  databaseUrl: String(process.env.DATABASE_URL),
  discordClientId: String(process.env.DISCORD_CLIENT_ID),
  discordClientSecret: String(process.env.DISCORD_CLIENT_SECRET),
  host: String(process.env.HOST),
  nodeEnv: String(process.env.NODE_ENV).trim(),
  jwtSecret: String(process.env.JWT_SECRET),
  serverPort: parseInt(String(process.env.PORT), 10),
}
