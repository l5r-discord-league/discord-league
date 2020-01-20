import { AsyncRouter } from 'express-async-router'

import { ping } from './handlers/ping'

export default () => {
  const router = AsyncRouter()

  router.get('/ping', ping)

  return router
}
