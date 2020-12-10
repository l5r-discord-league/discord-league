import jwt from 'jsonwebtoken'
import env from '../env'

export interface JwtPayload {
  flags: number
  d_id: string
  d_usr: string
  d_tag: string
  d_img: string
}

export async function verify(token: string, secret: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) reject(err)
      resolve(payload as JwtPayload)
    })
  })
}

export async function sign(payload: JwtPayload): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, env.jwtSecret, { expiresIn: '30d' }, (err, jwtToken) => {
      if (err) reject(err)
      resolve(jwtToken)
    })
  })
}
