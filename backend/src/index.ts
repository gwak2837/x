import cors from '@elysiajs/cors'
import serverTiming from '@elysiajs/server-timing'
import swagger from '@elysiajs/swagger'
import { Elysia, t } from 'elysia'
import { networkInterfaces } from 'os'

import { ENV, PORT } from './constants'
import auth from './plugin/auth'
import example from './plugin/example'
import { sql } from './plugin/postgres'
import route from './route'

// TODO: Rate limit, Logger
export type BaseElysia = typeof app

export const app = new Elysia()
  .on('start', () => {
    console.log(`🦊 Elysia is running at: ${app.server?.url}`)

    if (process.env.NODE_ENV !== 'production') {
      const nets = networkInterfaces()
      if (nets.en0) {
        console.log(`   On Your Network:      http://${nets.en0[1].address}:${PORT}`)
      }
    }
  })
  .onError(({ error }) => {
    if (error.name === 'PostgresError') {
      console.error(error)
      return new Response('Bad Gateway', { status: 502 })
    }
  })
  .on('stop', async () => {
    await Promise.all([sql.end({ timeout: 5000 })])
    console.log('🦊 Elysia is stopped')
  })
  .use(
    cors({
      origin: [/^https?:\/\/localhost:\d+$/, /^https:\/\/.+\.vercel\.app$/],
      allowedHeaders: '*',
      exposeHeaders: '',
      maxAge: 86400,
    }),
  )
  .use(serverTiming())
  .use(swagger())
  .use(auth())
  .derive(() => ({ sql }))
  .get('/', async () => ({ ENV, NODE_ENV: process.env.NODE_ENV }), {
    response: {
      200: t.Object({
        ENV: t.String(),
        NODE_ENV: t.Optional(t.String()),
      }),
    },
  })
  .get('/live', () => ({ uptime: Bun.nanoseconds() }), {
    response: { 200: t.Object({ uptime: t.Number() }) },
  })
  .get(
    '/ready',
    async ({ error, sql }) => {
      type Result = [{ current_timestamp: Date }]
      const result = await sql<Result>`SELECT CURRENT_TIMESTAMP`

      const timestamp = result?.[0]
      if (!timestamp) return error(502, 'Bad Gateway')

      return timestamp
    },
    {
      response: {
        200: t.Object({ current_timestamp: t.Date() }),
        502: t.String(),
      },
    },
  )

if (process.env.NODE_ENV === 'development') {
  app.use(example)
}

app.use(route).listen({ hostname: '0.0.0.0', port: PORT || 4000 })
