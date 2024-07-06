import cors from '@elysiajs/cors'
import jwt from '@elysiajs/jwt'
import { Elysia, NotFoundError, t } from 'elysia'
import { JWT_SECRET, NODE_ENV, PORT } from './constants'
import Stream from '@elysiajs/stream'
import swagger from '@elysiajs/swagger'
import bearer from '@elysiajs/bearer'
import serverTiming from '@elysiajs/server-timing'

// TODO: Logger, Rate limit, OAuth2
const app = new Elysia()
  .use(bearer())
  .use(
    cors({
      origin: [/^https?:\/\/localhost:\d+$/, /^https:\/\/.*\.vercel\.app$/],
      allowedHeaders: '',
      exposedHeaders: '',
      maxAge: 86400,
    }),
  )
  .use(jwt({ secret: JWT_SECRET }))
  .use(serverTiming())
  .use(swagger())
  .get('/healthz', () => new Response('OK', { status: 200 }), { response: { 200: t.String() } })
  .get(
    '/readyz',
    () => {
      // TODO: redis, database 연결 확인
      return new Response('OK', { status: 200 })
    },
    { response: { 200: t.String() } },
  )
  .listen(PORT)

if (NODE_ENV !== 'production') {
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
    .get('/bearer', ({ bearer }) => ({ bearer }), {
      response: { 200: t.Object({ bearer: t.Optional(t.String()) }) },
    })
    .get('/jwt', async ({ jwt }) => ({ jwt: await jwt.sign({ message: 'Hello world!' }) }), {
      response: { 200: t.Object({ jwt: t.String() }) },
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
}

console.log(`🦊 Elysia is running at ${app.server?.url}`)
