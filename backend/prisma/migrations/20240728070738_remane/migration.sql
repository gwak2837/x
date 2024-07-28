/*
  Warnings:

  - You are about to drop the `PostHashTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostHashTag" DROP CONSTRAINT "PostHashTag_hashtagId_fkey";

-- DropForeignKey
ALTER TABLE "PostHashTag" DROP CONSTRAINT "PostHashTag_postId_fkey";

-- DropTable
DROP TABLE "PostHashTag";

-- CreateTable
CREATE TABLE "PostHashtag" (
    "postId" BIGINT NOT NULL,
    "hashtagId" BIGINT NOT NULL,

    CONSTRAINT "PostHashtag_pkey" PRIMARY KEY ("postId","hashtagId")
);

-- AddForeignKey
ALTER TABLE "PostHashtag" ADD CONSTRAINT "PostHashtag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostHashtag" ADD CONSTRAINT "PostHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
