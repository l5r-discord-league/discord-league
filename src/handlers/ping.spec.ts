import { test } from 'ava-fast-check'
import request from 'supertest'

import createApp from '../app'

test('always replies "pong"', async (t) => {
  const { app } = await createApp()
  const response = await request(app).get('/api/ping')

  t.is(response.status, 200)
  t.is(response.text, 'pong')
})
