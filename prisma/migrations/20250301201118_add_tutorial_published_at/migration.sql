-- AlterTable
ALTER TABLE "Badge" ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tutorial" ADD COLUMN     "publishedAt" TIMESTAMP(3);
