import cors from '@elysiajs/cors'
import { Elysia, t } from 'elysia'
import { PORT } from './constants'
import swagger from '@elysiajs/swagger'
import route from './route'
import auth from './plugin/auth'
import serverTiming from '@elysiajs/server-timing'
import { logger } from '@bogeychan/elysia-logger'

// TODO: Rate limit, OAuth2
export type BaseElysia = typeof app
const app = new Elysia()
  .use(
    cors({
      origin: [/^https?:\/\/localhost:\d+$/, /^https:\/\/.*\.vercel\.app$/],
      allowedHeaders: '',
      exposedHeaders: '',
      maxAge: 86400,
    }),
  )
  .use(serverTiming())
  .use(swagger())
  .use(logger())
  .use(auth())
  .get('/healthz', () => new Response(process.env.NODE_ENV, { status: 200 }), {
    response: { 200: t.String() },
  })
  .get(
    '/readyz',
    () => {
      // TODO: redis, database 연결 확인
      return new Response('OK', { status: 200 })
    },
    { response: { 200: t.String() } },
  )

if (process.env.NODE_ENV !== 'production') {
  const { default: example } = await import('./plugin/example')
  app.use(example)
}

app.use(route).listen(PORT)

console.log(`🦊 Elysia is running at ${app.server?.url}`)
