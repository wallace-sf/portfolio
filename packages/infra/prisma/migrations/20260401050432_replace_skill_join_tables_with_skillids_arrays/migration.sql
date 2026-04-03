/*
  Warnings:

  - You are about to drop the `ExperienceSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExperienceSkill" DROP CONSTRAINT "ExperienceSkill_experienceId_fkey";

-- DropForeignKey
ALTER TABLE "ExperienceSkill" DROP CONSTRAINT "ExperienceSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSkill" DROP CONSTRAINT "ProjectSkill_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSkill" DROP CONSTRAINT "ProjectSkill_skillId_fkey";

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "skillIds" UUID[];

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "skillIds" UUID[];

-- DropTable
DROP TABLE "ExperienceSkill";

-- DropTable
DROP TABLE "ProjectSkill";
