-- CreateIndex
CREATE INDEX "tweets_authorId_idx" ON "tweets"("authorId");

-- CreateIndex
CREATE INDEX "tweets_parentId_idx" ON "tweets"("parentId");

-- CreateIndex
CREATE INDEX "tweets_createdAt_idx" ON "tweets"("createdAt");
