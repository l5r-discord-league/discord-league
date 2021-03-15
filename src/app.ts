import * as Sentry from '@sentry/node'
import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import path from 'path'

import env from './env'
import { discordOAuthStrategy } from './middlewares/discordOAuth'
import api from './api'

Sentry.init({ dsn: env.sentryDsn })

export default async (): Promise<{ app: Express; run: () => void }> => {
  const app = express()

  app.use(
    Sentry.Handlers.requestHandler({
      request: ['data', 'method', 'query_string', 'url'],
      user: ['d_id', 'flags'],
    })
  )

  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(discordOAuthStrategy())

  app.use(cors())
  app.use('/api', api())
  app.use(express.static(path.resolve(__dirname, 'public')))
  app.get('/*', function (req: Request, res: Response) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  })

  app.use(Sentry.Handlers.errorHandler())

  return {
    app,
    run: (): void => {
      app.listen(env.serverPort, () => {
        console.log(`server started at http://localhost:${env.serverPort}`)
      })
    },
  }
}
