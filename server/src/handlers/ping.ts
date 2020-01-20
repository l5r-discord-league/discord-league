import { Request, Response } from 'express-async-router'

export async function ping(req: Request, res: Response) {
  res.send('pong')
}
