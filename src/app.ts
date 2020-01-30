import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Express } from 'express'
import helmet from 'helmet'
import path from 'path'

import env from './env'
import { pg } from './gateways/storage'
import { discordOAuthStrategy } from './middlewares/discordOAuth'
import routes from './routes'

export default async (): Promise<{ app: Express; run: () => void }> => {
  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(discordOAuthStrategy())

  app.use(cors())
  app.use(express.static('public'))
  app.use(routes())
  app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'))
  })

  await pg.migrate.latest({ directory: path.resolve(__dirname, 'migrations') })

  return {
    app,
    run: (): void => {
      app.listen(env.serverPort, () => {
        console.log(`server started at http://localhost:${env.serverPort}`)
      })
    },
  }
}
