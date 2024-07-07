-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "unsuspendAt" TIMESTAMP(3),
    "suspendedType" SMALLINT,
    "suspendedReason" TEXT,
    "ageRange" SMALLINT NOT NULL,
    "bio" VARCHAR(255),
    "birthDate" DATE,
    "grade" SMALLINT NOT NULL DEFAULT 0,
    "name" VARCHAR(255),
    "nickname" VARCHAR(255),
    "profileImageURLs" TEXT[],
    "sex" SMALLINT NOT NULL DEFAULT 0,
    "config" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollow" (
    "leaderId" UUID NOT NULL,
    "followerId" UUID NOT NULL,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("leaderId","followerId")
);

-- CreateTable
CREATE TABLE "OAuth" (
    "id" TEXT NOT NULL,
    "provider" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255),
    "profileImageURL" TEXT,
    "userId" UUID,

    CONSTRAINT "OAuth_pkey" PRIMARY KEY ("id","provider")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "publishAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" SMALLINT NOT NULL DEFAULT 0,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "content" TEXT,
    "imageURLs" TEXT[],
    "authorId" UUID,
    "parentPostId" BIGINT,
    "referredPostId" BIGINT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE INDEX "OAuth_userId_idx" ON "OAuth" USING HASH ("userId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post" USING HASH ("authorId");

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuth" ADD CONSTRAINT "OAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_referredPostId_fkey" FOREIGN KEY ("referredPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
