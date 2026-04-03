-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('EDUCATION', 'TECHNOLOGY', 'LANGUAGE', 'SOFT', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'SELF_EMPLOYED', 'FREELANCE', 'TEMPORARY', 'INTERNSHIP', 'APPRENTICE', 'TRAINEE');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL,
    "description" JSONB NOT NULL,
    "icon" TEXT NOT NULL,
    "type" "SkillType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL,
    "coverImageAlt" JSONB NOT NULL,
    "title" JSONB NOT NULL,
    "caption" JSONB NOT NULL,
    "content" TEXT NOT NULL,
    "theme" JSONB,
    "summary" JSONB,
    "objectives" JSONB,
    "role" JSONB,
    "team" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "relatedProjectSlugs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSkill" (
    "projectId" UUID NOT NULL,
    "skillId" UUID NOT NULL,

    CONSTRAINT "ProjectSkill_pkey" PRIMARY KEY ("projectId","skillId")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" UUID NOT NULL,
    "company" JSONB NOT NULL,
    "position" JSONB NOT NULL,
    "location" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "logoAlt" JSONB NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "locationType" "LocationType" NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceSkill" (
    "experienceId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "workDescription" JSONB NOT NULL,

    CONSTRAINT "ExperienceSkill_pkey" PRIMARY KEY ("experienceId","skillId")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "headline" JSONB NOT NULL,
    "bio" JSONB NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "photoAlt" JSONB NOT NULL,
    "featuredProjectSlugs" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileStat" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "label" JSONB NOT NULL,
    "value" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProfileStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialNetwork" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "SocialNetwork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "ProjectSkill_skillId_idx" ON "ProjectSkill"("skillId");

-- CreateIndex
CREATE INDEX "ExperienceSkill_skillId_idx" ON "ExperienceSkill"("skillId");

-- CreateIndex
CREATE INDEX "ProfileStat_profileId_order_idx" ON "ProfileStat"("profileId", "order");

-- CreateIndex
CREATE INDEX "SocialNetwork_profileId_idx" ON "SocialNetwork"("profileId");

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceSkill" ADD CONSTRAINT "ExperienceSkill_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceSkill" ADD CONSTRAINT "ExperienceSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileStat" ADD CONSTRAINT "ProfileStat_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialNetwork" ADD CONSTRAINT "SocialNetwork_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
