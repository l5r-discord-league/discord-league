import jwt from 'jsonwebtoken'
import env from '../env'

/* eslint-disable camelcase */
export interface JwtPayload {
  flags: number
  d_id: string
  d_usr: string
  d_tag: string
  d_img: string
}
/* eslint-enable camelcase */

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
      if (err) return reject(err)
      if (jwtToken == null) return reject(new Error('Empty token'))
      resolve(jwtToken)
    })
  })
}
