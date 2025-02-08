-- AlterTable
ALTER TABLE "EventConfig" ADD COLUMN     "bgColor" TEXT DEFAULT '#000000',
ADD COLUMN     "bgImageUrl" TEXT DEFAULT 'synapsis-flyer.png',
ADD COLUMN     "logoImageUrl" TEXT DEFAULT 'synapsis-logo.png';
