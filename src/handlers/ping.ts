import { Request, Response } from 'express-async-router'

export async function ping(req: Request, res: Response): Promise<void> {
  res.send('pong')
}
