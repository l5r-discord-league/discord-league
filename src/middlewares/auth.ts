import { Request, Response } from 'express-async-router'
import env from '../env'
import { verify, JwtPayload } from '../utils/jwt'

const prefix = 'Bearer '

export interface AuthenticatedRequest extends Omit<Request, 'user'> {
  user: JwtPayload
}

export async function authenticate(
  req: Request | AuthenticatedRequest,
  res: Response
): Promise<Response | void> {
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
