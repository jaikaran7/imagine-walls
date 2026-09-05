-- CreateTable
CREATE TABLE "admin_reviews" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'quote',
    "title" TEXT NOT NULL DEFAULT '',
    "quote" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "detail" TEXT NOT NULL DEFAULT '',
    "headline" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#E9CCFF',
    "sort_order" INTEGER NOT NULL DEFAULT 99,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_reviews_pkey" PRIMARY KEY ("id")
);
