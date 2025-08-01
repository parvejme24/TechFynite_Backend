/*
  Warnings:

  - You are about to drop the column `reply` on the `blog_reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blog_reviews" DROP COLUMN "reply",
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "blog_review_replies" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "replyText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_review_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "blog_review_replies_reviewId_idx" ON "blog_review_replies"("reviewId");

-- CreateIndex
CREATE INDEX "blog_review_replies_adminId_idx" ON "blog_review_replies"("adminId");

-- CreateIndex
CREATE INDEX "blog_review_replies_createdAt_idx" ON "blog_review_replies"("createdAt");

-- AddForeignKey
ALTER TABLE "blog_review_replies" ADD CONSTRAINT "blog_review_replies_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "blog_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_review_replies" ADD CONSTRAINT "blog_review_replies_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
