import * as express from 'express'

import env from '../env'
import { isJwtError, verify } from '../utils/jwt'

const prefix = 'Bearer '

export async function withBearerToken(req: express.Request): Promise<void> {
  const authorizationHeader = req.get('Authorization')
  if (!authorizationHeader || !authorizationHeader.startsWith(prefix)) {
    return
  }

  const token = authorizationHeader.slice(prefix.length)
  try {
    const user = await verify(token, env.jwtSecret)
    req.user = user
  } catch (error) {
    // noop
  }
}

export async function authenticate(req: express.Request, res: express.Response): Promise<void> {
  const authorizationHeader = req.get('Authorization')
  if (!authorizationHeader || !authorizationHeader.startsWith(prefix)) {
    res.status(401).set('WWW-Authenticate', 'Bearer').send()
    return
  }

  const token = authorizationHeader.slice(prefix.length)
  try {
    const user = await verify(token, env.jwtSecret)
    req.user = user
  } catch (error) {
    if (isJwtError(error)) {
      res.status(403).send()
    } else {
      res.status(500).send()
    }
  }
}

export async function onlyLoggedIn(req: express.Request, res: express.Response): Promise<void> {
  if (req.user?.flags != null) {
    res.status(403).send()
  }
}

export async function onlyAdmin(req: express.Request, res: express.Response): Promise<void> {
  if (req.user?.flags !== 1) {
    res.status(403).send()
  }
}
