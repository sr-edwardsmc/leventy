/*
  Warnings:

  - Added the required column `status` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tickedId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketingId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'USED', 'CANCELED');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "generatedById" TEXT,
ADD COLUMN     "status" "TicketStatus" NOT NULL,
ADD COLUMN     "tickedId" TEXT NOT NULL,
ADD COLUMN     "ticketingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "idNumber" TEXT DEFAULT '1000443942',
ADD COLUMN     "phone" TEXT DEFAULT '0000000000';

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ticketingId_fkey" FOREIGN KEY ("ticketingId") REFERENCES "Ticketing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
