/*
  Warnings:

  - The `description` column on the `templates` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "templates" DROP COLUMN "description",
ADD COLUMN     "description" TEXT[];
