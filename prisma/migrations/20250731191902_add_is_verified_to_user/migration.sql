/*
  Warnings:

  - Added the required column `subject` to the `contact_replies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contact_replies" ADD COLUMN     "subject" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT true;
