-- Add client name for project detail meta (Client / Location / Year)
ALTER TABLE "admin_projects"
  ADD COLUMN IF NOT EXISTS "client" TEXT NOT NULL DEFAULT '';
