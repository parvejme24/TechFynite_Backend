/*
  Warnings:

  - You are about to drop the column `isApproved` on the `blog_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isDelivered` on the `order_invoices` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `templates` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `templates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "blog_reviews_isApproved_idx";

-- AlterTable
ALTER TABLE "blog_reviews" DROP COLUMN "isApproved";

-- AlterTable
ALTER TABLE "order_invoices" DROP COLUMN "isDelivered",
ADD COLUMN     "licenseKey" TEXT;

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "views",
ADD COLUMN     "lemonsqueezyPermalink" TEXT,
ADD COLUMN     "lemonsqueezyProductId" TEXT,
ADD COLUMN     "lemonsqueezyVariantId" TEXT,
ADD COLUMN     "slug" TEXT;

-- Update existing templates with slug based on title
UPDATE "templates" SET "slug" = LOWER(REGEXP_REPLACE("title", '[^a-zA-Z0-9\s-]', '', 'g')) WHERE "slug" IS NULL;
UPDATE "templates" SET "slug" = REGEXP_REPLACE("slug", '\s+', '-', 'g') WHERE "slug" IS NOT NULL;

-- Make slugs unique by adding timestamp if needed
UPDATE "templates" SET "slug" = "slug" || '-' || EXTRACT(EPOCH FROM NOW())::TEXT 
WHERE "id" IN (
  SELECT "id" FROM "templates" 
  WHERE "slug" IN (
    SELECT "slug" FROM "templates" 
    GROUP BY "slug" 
    HAVING COUNT(*) > 1
  )
  AND "id" NOT IN (
    SELECT MIN("id") FROM "templates" 
    GROUP BY "slug" 
    HAVING COUNT(*) > 1
  )
);

-- Make slug NOT NULL after updating
ALTER TABLE "templates" ALTER COLUMN "slug" SET NOT NULL;

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "licenseKey" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "licenses_licenseKey_key" ON "licenses"("licenseKey");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_orderId_key" ON "licenses"("orderId");

-- CreateIndex
CREATE INDEX "licenses_licenseKey_idx" ON "licenses"("licenseKey");

-- CreateIndex
CREATE INDEX "licenses_templateId_idx" ON "licenses"("templateId");

-- CreateIndex
CREATE INDEX "licenses_userId_idx" ON "licenses"("userId");

-- CreateIndex
CREATE INDEX "licenses_orderId_idx" ON "licenses"("orderId");

-- CreateIndex
CREATE INDEX "licenses_isValid_idx" ON "licenses"("isValid");

-- CreateIndex
CREATE UNIQUE INDEX "templates_slug_key" ON "templates"("slug");

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order_invoices"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
