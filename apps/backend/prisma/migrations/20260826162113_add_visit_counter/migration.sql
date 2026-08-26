-- CreateTable
CREATE TABLE "VisitCounter" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitCounter_pkey" PRIMARY KEY ("id")
);
