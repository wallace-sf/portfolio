-- AlterTable: add thumbnailImage columns with a temporary default for existing rows
ALTER TABLE "Project"
  ADD COLUMN "thumbnailImageUrl" TEXT NOT NULL DEFAULT 'https://placehold.co/760x630',
  ADD COLUMN "thumbnailImageAlt" JSONB NOT NULL DEFAULT '{}';

-- Remove defaults so future inserts require explicit values
ALTER TABLE "Project"
  ALTER COLUMN "thumbnailImageUrl" DROP DEFAULT,
  ALTER COLUMN "thumbnailImageAlt" DROP DEFAULT;
