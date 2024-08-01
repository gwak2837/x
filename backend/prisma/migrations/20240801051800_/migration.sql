-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nameLastModified" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserBookmarkPost" (
    "userId" BIGINT NOT NULL,
    "postId" BIGINT NOT NULL,

    CONSTRAINT "UserBookmarkPost_pkey" PRIMARY KEY ("userId","postId")
);

-- AddForeignKey
ALTER TABLE "UserBookmarkPost" ADD CONSTRAINT "UserBookmarkPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookmarkPost" ADD CONSTRAINT "UserBookmarkPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
