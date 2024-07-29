import { NotFoundError, t } from 'elysia'

import { BaseElysia } from '..'

export default (app: BaseElysia) =>
  app
    .get('/', ({ query }) => ({ message: `Hello ${query.name || 'world'}!` }), {
      query: t.Object({ name: t.Optional(t.String()) }),
      response: { 200: t.Object({ message: t.String() }) },
    })
    .get('/302', ({ redirect }) => redirect('https://google.com', 302))
    .get('/403', ({ error }) => error(403, 'Forbidden'), {
      response: { 403: t.String() },
    })
    .get('/404', () => {
      throw new NotFoundError('Not found')
    })
    .get('/user', ({ userId }) => ({ userId: userId?.toString() }), {
      response: { 200: t.Object({ userId: t.Optional(t.String()) }) },
    })
    .get('/stream', async function* ({ set }) {
      set.headers['x-name'] = 'Elysia'

      yield 1
      yield 2
      yield 3
    })
    .ws('/ws', { message: (ws, message) => ws.send({ message, time: Date.now() }) })
