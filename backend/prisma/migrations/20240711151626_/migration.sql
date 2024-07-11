/*
  Warnings:

  - The `userId` column on the `OAuth` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `authorId` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserFollow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `leaderId` on the `UserFollow` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `followerId` on the `UserFollow` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "OAuth" DROP CONSTRAINT "OAuth_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollow" DROP CONSTRAINT "UserFollow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollow" DROP CONSTRAINT "UserFollow_leaderId_fkey";

-- DropIndex
DROP INDEX "OAuth_userId_idx";

-- DropIndex
DROP INDEX "Post_authorId_idx";

-- AlterTable
ALTER TABLE "OAuth" DROP COLUMN "userId",
ADD COLUMN     "userId" BIGINT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId",
ADD COLUMN     "authorId" BIGINT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserFollow" DROP CONSTRAINT "UserFollow_pkey",
DROP COLUMN "leaderId",
ADD COLUMN     "leaderId" BIGINT NOT NULL,
DROP COLUMN "followerId",
ADD COLUMN     "followerId" BIGINT NOT NULL,
ADD CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("leaderId", "followerId");

-- CreateIndex
CREATE INDEX "OAuth_userId_idx" ON "OAuth"("userId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuth" ADD CONSTRAINT "OAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
