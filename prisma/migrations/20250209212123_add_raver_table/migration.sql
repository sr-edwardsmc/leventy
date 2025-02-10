-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_userId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "raverId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "city" SET DEFAULT 'Medellín';

-- CreateTable
CREATE TABLE "Raver" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "idType" TEXT DEFAULT 'CC',
    "birthday" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Raver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Raver_id_key" ON "Raver"("id");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_raverId_fkey" FOREIGN KEY ("raverId") REFERENCES "Raver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
