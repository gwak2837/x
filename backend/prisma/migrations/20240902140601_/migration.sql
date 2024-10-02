/*
  Warnings:

  - A unique constraint covering the columns `[type,name]` on the table `MangaInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Manga` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "MangaInfo_type_name_idx";

-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "type" SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE "MangaInfo" ALTER COLUMN "type" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "MangaInfo_type_name_key" ON "MangaInfo"("type", "name");
