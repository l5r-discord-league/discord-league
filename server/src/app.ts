import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import env from './env'
import { discordOAuthStrategy } from './middlewares/discordOAuth'
import routes from './routes'

export default async () => {
  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())

  app.use(discordOAuthStrategy())
  app.use(routes())

  return {
    app,
    run: () => {
      app.listen(env.serverPort, () => {
        console.log(`server started at http://localhost:${env.serverPort}`)
      })
    },
  }
}
