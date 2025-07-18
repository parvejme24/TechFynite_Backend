-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "projectDetails" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "serviceRequred" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);
