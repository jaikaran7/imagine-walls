import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailContent } from "@/components/services/service-detail-content";
import { services, getServiceBySlug } from "@/lib/data/services";
import { getProjects } from "@/lib/projects";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.shortDescription };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const allProjects = await getProjects();
  const related = allProjects
    .filter(
      (p) =>
        service.relatedProjectSlugs.includes(p.slug) ||
        p.servicesInvolved.some(
          (label) => label.toLowerCase() === service.title.toLowerCase(),
        ) ||
        p.category === service.title,
    )
    .slice(0, 3);

  return <ServiceDetailContent slug={slug} relatedProjects={related} />;
}
