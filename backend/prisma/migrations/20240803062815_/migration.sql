/*
  Warnings:

  - You are about to alter the column `name` on the `Hashtag` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(280)`.

*/
-- AlterTable
ALTER TABLE "Hashtag" ALTER COLUMN "name" SET DATA TYPE VARCHAR(280);

-- AlterTable
ALTER TABLE "UserFollow" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
