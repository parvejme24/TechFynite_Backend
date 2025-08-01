/*
  Warnings:

  - You are about to drop the `BlogContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pricing` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `blogs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `newsletters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlogContent" DROP CONSTRAINT "BlogContent_blogId_fkey";

-- DropForeignKey
ALTER TABLE "blog_likes" DROP CONSTRAINT "blog_likes_blogId_fkey";

-- DropForeignKey
ALTER TABLE "blog_likes" DROP CONSTRAINT "blog_likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "blog_reviews" DROP CONSTRAINT "blog_reviews_blogId_fkey";

-- DropForeignKey
ALTER TABLE "blog_reviews" DROP CONSTRAINT "blog_reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_authorId_fkey";

-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_categoryId_fkey";

-- AlterTable
ALTER TABLE "blog_reviews" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rating" INTEGER DEFAULT 5;

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "newsletters" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "isVerified" DROP NOT NULL;

-- DropTable
DROP TABLE "BlogContent";

-- DropTable
DROP TABLE "Pricing";

-- CreateTable
CREATE TABLE "blog_contents" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "description" TEXT[],
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "license" TEXT NOT NULL,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "duration" "Duration" NOT NULL,
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "blog_contents_blogId_idx" ON "blog_contents"("blogId");

-- CreateIndex
CREATE INDEX "blog_contents_order_idx" ON "blog_contents"("order");

-- CreateIndex
CREATE INDEX "pricing_duration_idx" ON "pricing"("duration");

-- CreateIndex
CREATE INDEX "pricing_recommended_idx" ON "pricing"("recommended");

-- CreateIndex
CREATE INDEX "blog_categories_createdAt_idx" ON "blog_categories"("createdAt");

-- CreateIndex
CREATE INDEX "blog_likes_blogId_idx" ON "blog_likes"("blogId");

-- CreateIndex
CREATE INDEX "blog_likes_userId_idx" ON "blog_likes"("userId");

-- CreateIndex
CREATE INDEX "blog_reviews_blogId_idx" ON "blog_reviews"("blogId");

-- CreateIndex
CREATE INDEX "blog_reviews_userId_idx" ON "blog_reviews"("userId");

-- CreateIndex
CREATE INDEX "blog_reviews_createdAt_idx" ON "blog_reviews"("createdAt");

-- CreateIndex
CREATE INDEX "blog_reviews_isApproved_idx" ON "blog_reviews"("isApproved");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_categoryId_idx" ON "blogs"("categoryId");

-- CreateIndex
CREATE INDEX "blogs_authorId_idx" ON "blogs"("authorId");

-- CreateIndex
CREATE INDEX "blogs_createdAt_idx" ON "blogs"("createdAt");

-- CreateIndex
CREATE INDEX "blogs_isPublished_idx" ON "blogs"("isPublished");

-- CreateIndex
CREATE INDEX "blogs_slug_idx" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "contact_replies_contactId_idx" ON "contact_replies"("contactId");

-- CreateIndex
CREATE INDEX "contact_replies_userId_idx" ON "contact_replies"("userId");

-- CreateIndex
CREATE INDEX "contacts_userId_idx" ON "contacts"("userId");

-- CreateIndex
CREATE INDEX "contacts_status_idx" ON "contacts"("status");

-- CreateIndex
CREATE INDEX "contacts_createdAt_idx" ON "contacts"("createdAt");

-- CreateIndex
CREATE INDEX "newsletters_email_idx" ON "newsletters"("email");

-- CreateIndex
CREATE INDEX "newsletters_isActive_idx" ON "newsletters"("isActive");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "order_invoices_userId_idx" ON "order_invoices"("userId");

-- CreateIndex
CREATE INDEX "order_invoices_templateId_idx" ON "order_invoices"("templateId");

-- CreateIndex
CREATE INDEX "templates_categoryId_idx" ON "templates"("categoryId");

-- CreateIndex
CREATE INDEX "templates_createdAt_idx" ON "templates"("createdAt");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_contents" ADD CONSTRAINT "blog_contents_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_reviews" ADD CONSTRAINT "blog_reviews_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_reviews" ADD CONSTRAINT "blog_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
