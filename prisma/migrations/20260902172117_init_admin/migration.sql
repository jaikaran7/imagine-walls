-- CreateTable
CREATE TABLE "enquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "project_type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "project_size" TEXT NOT NULL DEFAULT '',
    "budget_range" TEXT NOT NULL DEFAULT '',
    "timeline" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'New',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_projects" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 99,
    "short_description" TEXT NOT NULL DEFAULT '',
    "overview" TEXT NOT NULL DEFAULT '',
    "design_approach" TEXT NOT NULL DEFAULT '',
    "services_involved" JSONB NOT NULL DEFAULT '[]',
    "material_highlights" JSONB NOT NULL DEFAULT '[]',
    "cover_image" JSONB NOT NULL,
    "gallery" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotations" (
    "id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "client_email" TEXT NOT NULL DEFAULT '',
    "client_address" TEXT NOT NULL DEFAULT '',
    "project_type" TEXT NOT NULL,
    "project_title" TEXT NOT NULL,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "finalized_at" TIMESTAMP(3),

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "quotation_id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "client_email" TEXT NOT NULL DEFAULT '',
    "project_title" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payments" JSONB NOT NULL DEFAULT '[]',
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_projects_slug_key" ON "admin_projects"("slug");
