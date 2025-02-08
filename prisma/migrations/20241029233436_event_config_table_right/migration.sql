/*
  Warnings:

  - Made the column `eventId` on table `EventConfig` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_id_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "configId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "EventConfig" ALTER COLUMN "eventId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EventConfig" ADD CONSTRAINT "EventConfig_id_fkey" FOREIGN KEY ("id") REFERENCES "Event"("configId") ON DELETE RESTRICT ON UPDATE CASCADE;
