/*
  Warnings:

  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `email_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "email_templates" DROP CONSTRAINT "email_templates_createdBy_fkey";

-- AlterTable
ALTER TABLE "templates" ADD COLUMN     "sourceFiles" TEXT[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isVerified";

-- DropTable
DROP TABLE "email_templates";
