/*
  Warnings:

  - Added the required column `user_name` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "user_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saves" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "follower_type" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "views" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "user_type" TEXT,
    "user_id" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "likes_video_id_idx" ON "likes"("video_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_video_id_user_type_user_id_key" ON "likes"("video_id", "user_type", "user_id");

-- CreateIndex
CREATE INDEX "saves_video_id_idx" ON "saves"("video_id");

-- CreateIndex
CREATE INDEX "saves_user_id_idx" ON "saves"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "saves_video_id_user_type_user_id_key" ON "saves"("video_id", "user_type", "user_id");

-- CreateIndex
CREATE INDEX "follows_follower_id_idx" ON "follows"("follower_id");

-- CreateIndex
CREATE INDEX "follows_following_id_idx" ON "follows"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "follows_follower_id_following_id_key" ON "follows"("follower_id", "following_id");

-- CreateIndex
CREATE INDEX "views_video_id_idx" ON "views"("video_id");

-- CreateIndex
CREATE INDEX "views_created_at_idx" ON "views"("created_at");
