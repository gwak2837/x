import { NotFoundError, t } from 'elysia'

import type { BaseElysia } from '../..'

import { MangaInfoTypeString } from '../../model/MangaInfo'
import { POSTGRES_MAX_BIGINT_STRING } from '../../plugin/postgres'

export default function GETManga(app: BaseElysia) {
  return app.get(
    '/manga',
    async ({ error, query, sql }) => {
      const { cursor = POSTGRES_MAX_BIGINT_STRING, limit = 10, types, names } = query

      if ((!types && names) || (types && !names)) return error(400, 'Bad Request')
      if (types && names && types.length !== names.length) return error(400, 'Bad Request')

      const andTypeAndName =
        names && types
          ? Array(names.length)
              .fill(0)
              .map(
                (_, i) =>
                  sql`AND "MangaInfo".type = ${types[i]} AND "MangaInfo".name = ${names[i]}`,
              )
          : sql``

      const mangas = await sql<MangaRow[]>`
        SELECT "Manga".id,
          "Manga"."publishAt",
          "Manga".type,
          "Manga".title,
          "Manga"."imageCount",
          "MangaInfo".type,
          "MangaInfo".name
        FROM "Manga"
          JOIN "MangaMangaInfo" ON "Manga".id = "MangaMangaInfo"."mangaId"
          JOIN "MangaInfo" ON "MangaMangaInfo"."mangaInfoId" = "MangaInfo".id
        WHERE "Manga".id < ${cursor}
          ${andTypeAndName}
        LIMIT ${limit}`
      if (!mangas.length) throw new NotFoundError()

      return [...mangas]
    },
    {
      query: t.Object({
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Number()),
        types: t.Optional(t.Array(t.Enum(MangaInfoTypeString))),
        names: t.Optional(t.Array(t.String())),
      }),
      response: {
        200: schemaGETManga,
        400: t.String(),
        404: t.String(),
      },
    },
  )
}

type MangaRow = {
  id: string
  publishAt: Date
  title: string
  imageCount: number
  type: number
  name: string
}

const schemaGETManga = t.Array(
  t.Object({
    id: t.String(),
    publishAt: t.Date(),
    title: t.String(),
    imageCount: t.Number(),
    type: t.Integer(),
    name: t.String(),
  }),
)
