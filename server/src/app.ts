import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'

dotenv.config()

export default async () => {
  const port = process.env.SERVER_PORT
  const app = express()

  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded())

  app.get('/', (req, res) => {
    res.send('Uow')
  })

  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`)
  })

  return { app, run: () => {} }
}
