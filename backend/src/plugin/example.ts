import { NotFoundError, t } from 'elysia'
import { BaseElysia } from '..'
import Stream from '@elysiajs/stream'

export default (app: BaseElysia) =>
  app
    .get('/', ({ query }) => ({ message: `Hello ${query.name || 'world'}!` }), {
      query: t.Object({ name: t.Optional(t.String()) }),
      response: { 200: t.Object({ message: t.String() }) },
    })
    .get('/302', ({ redirect }) => redirect('https://google.com', 302))
    .get('/403', ({ error }) => error(403), {
      response: { 403: t.String() },
    })
    .get('/404', () => {
      throw new NotFoundError('Not found')
    })
    .get('/user', ({ userId }) => ({ userId }), {
      response: { 200: t.Object({ userId: t.Optional(t.String()) }) },
    })
    .get(
      '/stream',
      () =>
        new Stream(async (stream) => {
          stream.send('Hello')
          await stream.wait(3000)
          stream.send('world!')
          stream.close()
        }),
    )
    .ws('/ws', { message: (ws, message) => ws.send({ message, time: Date.now() }) })
