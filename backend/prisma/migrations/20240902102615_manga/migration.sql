-- CreateTable
CREATE TABLE "Manga" (
    "id" BIGINT NOT NULL,
    "publishAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "imageCount" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "Manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBookmarkManga" (
    "userId" BIGINT NOT NULL,
    "mangaId" BIGINT NOT NULL,

    CONSTRAINT "UserBookmarkManga_pkey" PRIMARY KEY ("userId","mangaId")
);

-- CreateTable
CREATE TABLE "MangaInfo" (
    "id" BIGSERIAL NOT NULL,
    "type" SMALLINT NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,

    CONSTRAINT "MangaInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MangaMangaInfo" (
    "mangaId" BIGINT NOT NULL,
    "mangaInfoId" BIGINT NOT NULL,

    CONSTRAINT "MangaMangaInfo_pkey" PRIMARY KEY ("mangaId","mangaInfoId")
);

-- CreateIndex
CREATE INDEX "Manga_title_idx" ON "Manga"("title");

-- CreateIndex
CREATE INDEX "MangaInfo_type_name_idx" ON "MangaInfo"("type", "name");

-- AddForeignKey
ALTER TABLE "UserBookmarkManga" ADD CONSTRAINT "UserBookmarkManga_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookmarkManga" ADD CONSTRAINT "UserBookmarkManga_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MangaMangaInfo" ADD CONSTRAINT "MangaMangaInfo_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MangaMangaInfo" ADD CONSTRAINT "MangaMangaInfo_mangaInfoId_fkey" FOREIGN KEY ("mangaInfoId") REFERENCES "MangaInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
