-- CreateTable
CREATE TABLE "Treatment" (
    "id" SERIAL NOT NULL,
    "disease" TEXT NOT NULL,
    "solution" TEXT NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);
