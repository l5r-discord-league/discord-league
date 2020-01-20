import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

import routes from './routes'

dotenv.config()

export default async () => {
  const port = process.env.SERVER_PORT
  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())

  app.use(routes())

  return {
    app,
    run: () => {
      app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`)
      })
    },
  }
}
