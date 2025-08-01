/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "fileUrl";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isVerified";

-- CreateTable
CREATE TABLE "contact_replies" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_replies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contact_replies" ADD CONSTRAINT "contact_replies_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_replies" ADD CONSTRAINT "contact_replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
