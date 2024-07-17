// import { PrismaClient } from '../../prisma/client'
import Elysia from 'elysia'

export default () => (app: Elysia) =>
  app.derive(async ({ error }) => {
    try {
      // const prisma = new PrismaClient({ log: process.env.NODE_ENV === 'test' ? [] : ['query'] })
      return {
        prisma: {
          $queryRaw: <T>(...args: any[]) => null as T,
        },
      }
    } catch (e) {
      console.error('👀 ~ e:', e)
      return error(502, (e as Error).message)
    }
  })
