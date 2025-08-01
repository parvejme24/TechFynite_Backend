/*
  Warnings:

  - You are about to drop the column `commentDate` on the `blog_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `blog_reviews` table. All the data in the column will be lost.
  - Added the required column `email` to the `blog_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `blog_reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `blog_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blog_reviews" DROP COLUMN "commentDate",
DROP COLUMN "userName",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "blog_reviews" ADD CONSTRAINT "blog_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
