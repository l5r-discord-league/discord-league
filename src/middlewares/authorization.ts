import * as express from 'express'

import env from '../env'
import { verify } from '../utils/jwt'

const prefix = 'Bearer '

export async function authenticate(req: express.Request, res: express.Response) {
  const authorizationHeader = req.get('Authorization')
  if (!authorizationHeader || !authorizationHeader.startsWith(prefix)) {
    return res
      .status(401)
      .set('WWW-Authenticate', 'Bearer')
      .send()
  }

  const token = authorizationHeader.slice(prefix.length)
  try {
    const user = await verify(token, env.jwtSecret)
    req.user = user
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError' ||
      error.name === 'NotBeforeError'
    ) {
      return res.status(403).send()
    }
  }
}

export async function onlyLoggedIn(req: express.Request, res: express.Response) {
  if (req.user?.flags != null) {
    res.status(403).send()
  }
}

export async function onlyAdmin(req: express.Request, res: express.Response) {
  if (req.user?.flags !== 1) {
    res.status(403).send()
  }
}
