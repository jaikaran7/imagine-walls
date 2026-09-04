import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage } from "@/components/media-image";
import { ImageMotion } from "@/components/motion/image-motion";
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
  const related = allProjects.filter((p) => service.relatedProjectSlugs.includes(p.slug));

  return (
    <article>
      <header className="container-edge pt-28 md:pt-36">
        <div className="border-t border-line pt-10">
          <p className="label mb-4">{service.number}</p>
          <h1 className="display-xl max-w-[14ch]">{service.title}</h1>
        </div>
      </header>

      <div className="mt-12 md:mt-16">
        <ImageMotion variant="scale" className="relative aspect-[16/9] w-full overflow-hidden bg-surface md:aspect-[21/9]">
          <MediaImage
            src={service.heroImage.src}
            alt={service.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </ImageMotion>
      </div>

      <section className="container-edge mt-20 md:mt-28">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="label md:col-span-3">Introduction</p>
          <p className="display-md max-w-3xl md:col-span-9">{service.fullDescription}</p>
        </div>
      </section>

      <section className="container-edge mt-20 border-t border-line pt-12 md:mt-28 md:pt-16">
        <p className="label mb-10">What&rsquo;s Included</p>
        <div className="grid gap-12 md:grid-cols-3">
          {service.features.map((feature) => (
            <div key={feature.label} className="border-t border-line pt-6">
              <h3 className="font-display text-xl">{feature.label}</h3>
              <p className="mt-3 text-sm text-ink-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-edge mt-20 border-t border-line pt-12 md:mt-28 md:pt-16">
          <p className="label mb-10">Related Projects</p>
          <div className="grid gap-12 md:grid-cols-2">
            {related.map((p, i) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group block">
                <ImageMotion variant={i === 0 ? "clipLeft" : "clipUp"} className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <MediaImage
                    src={p.coverImage.src}
                    alt={p.coverImage.alt}
                    fill
                    sizes="50vw"
                    className="object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.03]"
                  />
                </ImageMotion>
                <div className="mt-4 border-t border-line pt-3">
                  <h3 className="font-display text-xl">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-edge mt-20 border-t border-line py-20 text-center md:mt-28 md:py-28">
        <h2 className="display-md mx-auto max-w-xl">
          Ready to talk through your {service.title.toLowerCase()}?
        </h2>
        <Link href="/contact" className="btn-outline mt-8 inline-block">
          Book a Consultation
        </Link>
      </section>
    </article>
  );
}
