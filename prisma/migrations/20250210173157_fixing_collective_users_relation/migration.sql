/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Collective` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collective" DROP CONSTRAINT "Collective_ownerId_fkey";

-- DropIndex
DROP INDEX "Collective_ownerId_key";

-- AlterTable
ALTER TABLE "Collective" DROP COLUMN "ownerId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_collectiveId_fkey" FOREIGN KEY ("collectiveId") REFERENCES "Collective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
