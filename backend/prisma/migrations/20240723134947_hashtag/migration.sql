-- CreateTable
CREATE TABLE "Hashtag" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostHashTag" (
    "postId" BIGINT NOT NULL,
    "hashtagId" BIGINT NOT NULL,

    CONSTRAINT "PostHashTag_pkey" PRIMARY KEY ("postId","hashtagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_name_key" ON "Hashtag"("name");

-- AddForeignKey
ALTER TABLE "PostHashTag" ADD CONSTRAINT "PostHashTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostHashTag" ADD CONSTRAINT "PostHashTag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
