/*
  Warnings:

  - The values [USED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `createdAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('ACTIVE', 'CHECKED', 'ANNULLED');
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "TicketStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "checkedAt" TEXT,
ADD COLUMN     "createdAt" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TEXT;
