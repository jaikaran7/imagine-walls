import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { projects } from "../lib/data/projects";

config({ path: ".env.local" });

function createClient() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DIRECT_URL or DATABASE_URL is not set");
  }
  const pool = new Pool({ connectionString });
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function main() {
  const prisma = createClient();

  console.log("Seeding admin_projects…");

  for (const project of projects) {
    const data = {
      title: project.title,
      client: project.client,
      location: project.location,
      category: project.category,
      year: project.year,
      featured: project.featured,
      sortOrder: project.order,
      shortDescription: project.shortDescription,
      overview: project.overview,
      designApproach: project.designApproach,
      servicesInvolved: project.servicesInvolved,
      materialHighlights: project.materialHighlights,
      coverImage: {
        id: project.coverImage.id,
        src: project.coverImage.src,
        alt: project.coverImage.alt,
      },
      gallery: project.gallery.map(({ id, src, alt, caption }) => ({
        id,
        src,
        alt,
        ...(caption ? { caption } : {}),
      })),
    };

    const existing = await prisma.adminProject.findUnique({
      where: { slug: project.slug },
    });

    if (existing) {
      await prisma.adminProject.update({
        where: { slug: project.slug },
        data,
      });
      console.log(`  Updated: ${project.title}`);
    } else {
      await prisma.adminProject.create({
        data: {
          id: generateId("proj"),
          slug: project.slug,
          ...data,
        },
      });
      console.log(`  Created: ${project.title}`);
    }
  }

  const count = await prisma.adminProject.count();
  console.log(`Done — ${count} projects in admin_projects.`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
