import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import path from 'path'

import env from './env'
import { discordOAuthStrategy } from './middlewares/discordOAuth'
import api from './api'

export default async (): Promise<{ app: Express; run: () => void }> => {
  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(discordOAuthStrategy())

  app.use(cors())
  app.use('/api', api())
  app.use(express.static(path.resolve(__dirname, 'public')))
  app.get('/*', function (req: Request, res: Response) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  })

  return {
    app,
    run: (): void => {
      app.listen(env.serverPort, () => {
        console.log(`server started at http://localhost:${env.serverPort}`)
      })
    },
  }
}
