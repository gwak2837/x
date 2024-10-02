import { driver, getMangas } from './hitomi'
import { MangaInfoType, encodeMangaType } from './model'
import { sql } from './postgres'

try {
  const mangas = await getMangas()

  const mangaRows = mangas.map((manga) => ({
    ...manga,
    type: encodeMangaType(manga.type),
  }))

  const mangaInfoRows = mangas.flatMap((manga) => [
    ...manga.artists.map((artist) => ({
      id: manga.id,
      type: MangaInfoType.ARTISTS,
      name: artist,
    })),
    ...manga.series.map((series) => ({
      id: manga.id,
      type: MangaInfoType.SERIES,
      name: series,
    })),
    ...manga.characters.map((character) => ({
      id: manga.id,
      type: MangaInfoType.CHARACTERS,
      name: character,
    })),
    ...manga.group.map((group) => ({
      id: manga.id,
      type: MangaInfoType.GROUP,
      name: group,
    })),
    ...manga.tags.map((tag) => ({
      id: manga.id,
      type: MangaInfoType.TAGS,
      name: tag,
    })),
  ])

  await Promise.all([
    sql`
      INSERT INTO "Manga" ${sql(mangaRows, 'id', 'publishAt', 'type', 'title', 'imageCount')}
      ON CONFLICT (id) DO NOTHING`,
    sql`
      INSERT INTO "MangaInfo" ${sql(mangaInfoRows, 'type', 'name')}
      ON CONFLICT (type, name) DO NOTHING`,
  ])

  const mangaMangaInfoRows = mangaInfoRows.map(
    (info) => sql`, (
      (
        SELECT id 
        FROM "Manga" 
        WHERE id = ${info.id}
      ), (
        SELECT id 
        FROM "MangaInfo"
        WHERE type = ${info.type} AND name = ${info.name}
      )
    )`,
  )

  await sql`
    INSERT INTO "MangaMangaInfo" ("mangaId", "mangaInfoId")
    VALUES (${mangas[0].id}, (SELECT id FROM "MangaInfo" LIMIT 1)) ${mangaMangaInfoRows}
    ON CONFLICT ("mangaId", "mangaInfoId") DO NOTHING`
} finally {
  await driver.quit()
}
