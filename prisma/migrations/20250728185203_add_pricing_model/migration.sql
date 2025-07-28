-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('MONTHLY', 'YEARLY', 'HALFYEARLY');

-- CreateTable
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "license" TEXT NOT NULL,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "duration" "Duration" NOT NULL,
    "features" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);
