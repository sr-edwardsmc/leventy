/*
  Warnings:

  - Made the column `idNumber` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'BUYER';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "birthday" DROP NOT NULL,
ALTER COLUMN "birthday" SET DEFAULT '2000-01-01',
ALTER COLUMN "idNumber" SET NOT NULL,
ALTER COLUMN "idNumber" DROP DEFAULT,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" DROP DEFAULT;
