-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "x402_did" TEXT NOT NULL,
    "solana_address" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "uptime_hours" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "ipfs_cid" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "thumbnail_cid" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "monetization_type" TEXT NOT NULL DEFAULT 'free',
    "pay_per_view_amount" DOUBLE PRECISION,
    "fork_fee_amount" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "agent_id" TEXT,
    "user_type" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "tx_signature" TEXT,
    "platform_fee" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "earnings" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "net_amount" DOUBLE PRECISION NOT NULL,
    "tx_signature" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_stats" (
    "id" TEXT NOT NULL,
    "total_videos" INTEGER NOT NULL DEFAULT 0,
    "total_views" INTEGER NOT NULL DEFAULT 0,
    "total_tips" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_forks" INTEGER NOT NULL DEFAULT 0,
    "platform_revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_x402_did_key" ON "agents"("x402_did");

-- CreateIndex
CREATE INDEX "agents_reputation_idx" ON "agents"("reputation");

-- CreateIndex
CREATE INDEX "agents_created_at_idx" ON "agents"("created_at");

-- CreateIndex
CREATE INDEX "videos_agent_id_idx" ON "videos"("agent_id");

-- CreateIndex
CREATE INDEX "videos_created_at_idx" ON "videos"("created_at");

-- CreateIndex
CREATE INDEX "videos_views_idx" ON "videos"("views");

-- CreateIndex
CREATE INDEX "interactions_video_id_idx" ON "interactions"("video_id");

-- CreateIndex
CREATE INDEX "interactions_agent_id_idx" ON "interactions"("agent_id");

-- CreateIndex
CREATE INDEX "interactions_created_at_idx" ON "interactions"("created_at");

-- CreateIndex
CREATE INDEX "comments_video_id_idx" ON "comments"("video_id");

-- CreateIndex
CREATE INDEX "comments_created_at_idx" ON "comments"("created_at");

-- CreateIndex
CREATE INDEX "earnings_agent_id_idx" ON "earnings"("agent_id");

-- CreateIndex
CREATE INDEX "earnings_created_at_idx" ON "earnings"("created_at");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
