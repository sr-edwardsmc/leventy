/*
  Warnings:

  - A unique constraint covering the columns `[configId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "configId" TEXT DEFAULT 'null';

-- CreateTable
CREATE TABLE "EventConfig" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "ticketHtml" TEXT NOT NULL,
    "ticketingEmailAddress" TEXT NOT NULL,
    "ticketingAppPassword" TEXT NOT NULL,
    "emailFrom" TEXT NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,

    CONSTRAINT "EventConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventConfig_id_key" ON "EventConfig"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EventConfig_eventId_key" ON "EventConfig"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_configId_key" ON "Event"("configId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_id_fkey" FOREIGN KEY ("id") REFERENCES "EventConfig"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
