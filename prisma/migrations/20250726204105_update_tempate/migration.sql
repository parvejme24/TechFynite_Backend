/*
  Warnings:

  - You are about to drop the column `publishedDate` on the `templates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "publishedDate",
ADD COLUMN     "sourceFiles" TEXT[];
