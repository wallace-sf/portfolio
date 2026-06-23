-- AlterTable: convert Project.content from text to jsonb
-- Existing rows get their current text wrapped as the en-US locale value.
ALTER TABLE "Project"
  ALTER COLUMN "content" TYPE JSONB
  USING jsonb_build_object('en-US', "content"::text);
