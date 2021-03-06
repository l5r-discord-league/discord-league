import dotenv from 'dotenv'

dotenv.config()

export default {
  challongeApiKey: String(process.env.CHALLONGE_API_KEY),
  challongeUsername: String(process.env.CHALLONGE_USERNAME),
  databaseUrl: String(process.env.DATABASE_URL),
  discordBotToken: String(process.env.DISCORD_BOT_TOKEN),
  discordClientId: String(process.env.DISCORD_CLIENT_ID),
  discordClientSecret: String(process.env.DISCORD_CLIENT_SECRET),
  host: String(process.env.HOST),
  jwtSecret: String(process.env.JWT_SECRET),
  nodeEnv: String(process.env.NODE_ENV).trim(),
  serverPort: parseInt(String(process.env.PORT), 10),
}
