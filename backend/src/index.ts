import cors from '@elysiajs/cors'
import { Elysia } from 'elysia'

const app = new Elysia()
  .use(
    cors({
      origin: ['http://localhost', 'https://localhost', 'https://*.vercel.app'],
      allowedHeaders: [],
    }),
  )
  .get('/', () => 'Hello Elysia')
  .listen(4000)

console.log(`🦊 Elysia is running at ${app.server?.url}`)
