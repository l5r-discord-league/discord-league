import jwt, { SignOptions } from 'jsonwebtoken'
import util from 'util'
import env from '../env'

const verifyAsync = util.promisify(jwt.verify)
const signAsync = util.promisify<object, string, SignOptions, string>(jwt.sign)

export interface JwtPayload {
  flags: number
  d_id: string
  d_usr: string
  d_tag: string
  d_img: string
}

export async function verify(token: string, secret: string): Promise<JwtPayload> {
  const payload = await verifyAsync(token, secret)
  return payload as JwtPayload
}

export async function sign(payload: JwtPayload): Promise<string> {
  return signAsync(payload, env.jwtSecret, { expiresIn: '30d' })
}
