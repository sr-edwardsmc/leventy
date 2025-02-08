-- DropForeignKey
ALTER TABLE "EventConfig" DROP CONSTRAINT "EventConfig_id_fkey";

-- AddForeignKey
ALTER TABLE "EventConfig" ADD CONSTRAINT "EventConfig_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
