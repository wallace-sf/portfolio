-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "featuredProjectSlugs";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Project_weight_idx" ON "Project"("weight");

