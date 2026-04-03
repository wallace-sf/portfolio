-- AlterTable
ALTER TABLE "User" ADD COLUMN "authSubject" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "User_authSubject_key" ON "User"("authSubject");

-- CreateIndex
CREATE INDEX "User_authSubject_idx" ON "User"("authSubject");
