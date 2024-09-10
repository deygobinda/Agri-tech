-- CreateTable
CREATE TABLE "Crop" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "minTemp" DOUBLE PRECISION NOT NULL,
    "maxTemp" DOUBLE PRECISION NOT NULL,
    "minRainfall" DOUBLE PRECISION NOT NULL,
    "maxRainfall" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);
