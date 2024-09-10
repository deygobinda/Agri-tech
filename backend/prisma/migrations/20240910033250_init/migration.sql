/*
  Warnings:

  - You are about to drop the column `disease` on the `Treatment` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `Treatment` table. All the data in the column will be lost.
  - Added the required column `Crop` to the `Treatment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Disease` to the `Treatment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Treatment` to the `Treatment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Treatment" DROP COLUMN "disease",
DROP COLUMN "solution",
ADD COLUMN     "Crop" TEXT NOT NULL,
ADD COLUMN     "Disease" TEXT NOT NULL,
ADD COLUMN     "Treatment" TEXT NOT NULL;
