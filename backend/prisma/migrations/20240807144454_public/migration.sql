-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ageRangePublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "birthDatePublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sexPublic" BOOLEAN NOT NULL DEFAULT true;
