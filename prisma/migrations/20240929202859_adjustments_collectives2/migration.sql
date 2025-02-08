/*
  Warnings:

  - The values [ADMIN,EVENT_OWNER,USER,BUYER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,CANCELED] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SYSTEM_ADMIN', 'COLLECTIVE_ADMIN', 'COLLECTIVE_MEMBER', 'PROMOTER', 'DOORMAN', 'RAVER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('ACTIVE', 'USED', 'ANNULLED');
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "TicketStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "collectiveId" TEXT NOT NULL DEFAULT 'ev001';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "memberOfId" TEXT;

-- CreateTable
CREATE TABLE "Collective" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Collective_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collective_id_key" ON "Collective"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Collective_ownerId_key" ON "Collective"("ownerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_memberOfId_fkey" FOREIGN KEY ("memberOfId") REFERENCES "Collective"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collective" ADD CONSTRAINT "Collective_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_collectiveId_fkey" FOREIGN KEY ("collectiveId") REFERENCES "Collective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
