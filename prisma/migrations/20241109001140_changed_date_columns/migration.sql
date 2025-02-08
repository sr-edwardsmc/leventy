/*
  Warnings:

  - The `checkedAt` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdAt` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedAt` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `date` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startDate` on the `Ticketing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endDate` on the `Ticketing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "date" TYPE TIMESTAMP USING TO_TIMESTAMP("date", 'DD-MM-YYYY');


-- AlterTable
ALTER TABLE "Ticket"
ALTER COLUMN "createdAt" TYPE TIMESTAMP USING TO_TIMESTAMP("createdAt", 'DD-MM-YYYY'),
ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING TO_TIMESTAMP("updatedAt", 'DD-MM-YYYY'),
ALTER COLUMN "checkedAt" TYPE TIMESTAMP USING TO_TIMESTAMP("checkedAt", 'DD-MM-YYYY');

-- AlterTable
ALTER TABLE "Ticketing"
ALTER COLUMN "startDate" TYPE TIMESTAMP USING TO_TIMESTAMP("startDate", 'DD-MM-YYYY'),
ALTER COLUMN "endDate" TYPE TIMESTAMP USING TO_TIMESTAMP("endDate", 'DD-MM-YYYY');

-- AlterTable
ALTER TABLE "User" 
ALTER COLUMN "createdAt" TYPE TIMESTAMP USING TO_TIMESTAMP("createdAt", 'DD-MM-YYYY'),
ALTER COLUMN "updatedAt" TYPE TIMESTAMP USING TO_TIMESTAMP("updatedAt", 'DD-MM-YYYY');
