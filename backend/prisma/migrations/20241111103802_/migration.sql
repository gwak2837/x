/*
  Warnings:

  - You are about to drop the `Manga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MangaInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MangaMangaInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBookmarkManga` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MangaMangaInfo" DROP CONSTRAINT "MangaMangaInfo_mangaId_fkey";

-- DropForeignKey
ALTER TABLE "MangaMangaInfo" DROP CONSTRAINT "MangaMangaInfo_mangaInfoId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookmarkManga" DROP CONSTRAINT "UserBookmarkManga_mangaId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookmarkManga" DROP CONSTRAINT "UserBookmarkManga_userId_fkey";

-- DropTable
DROP TABLE "Manga";

-- DropTable
DROP TABLE "MangaInfo";

-- DropTable
DROP TABLE "MangaMangaInfo";

-- DropTable
DROP TABLE "UserBookmarkManga";
