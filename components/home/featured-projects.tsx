import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { Reveal } from "@/components/reveal";
import { getFeaturedProjects } from "@/lib/data/projects";

function ProjectTile({
  project,
  className,
  sizes,
  priority = false,
}: {
  project: ReturnType<typeof getFeaturedProjects>[number];
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group relative block overflow-hidden bg-surface ${className ?? ""}`}
    >
      <MediaImage
        src={project.coverImage.src}
        alt={project.coverImage.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.045]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
        <div>
          <p className="text-[0.65rem] uppercase tracking-widest2 text-white/70">
            {project.category} &middot; {project.location}
          </p>
          <p className="mt-1 font-display text-2xl text-white md:text-3xl">{project.title}</p>
        </div>
        <span className="hidden shrink-0 translate-y-2 text-xs uppercase tracking-widest2 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          View &rarr;
        </span>
      </div>
    </Link>
  );
}

export function FeaturedProjects() {
  const [first, second, third] = getFeaturedProjects();

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      {first && (
        <Reveal className="md:row-span-2">
          <ProjectTile
            project={first}
            className="aspect-[4/5] md:aspect-auto md:h-full"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </Reveal>
      )}
      <div className="flex flex-col gap-4 md:gap-5">
        {second && (
          <Reveal delay={0.1}>
            <ProjectTile project={second} className="aspect-[16/11]" sizes="(min-width: 768px) 50vw, 100vw" />
          </Reveal>
        )}
        {third && (
          <Reveal delay={0.2}>
            <ProjectTile project={third} className="aspect-[16/11]" sizes="(min-width: 768px) 50vw, 100vw" />
          </Reveal>
        )}
      </div>
    </div>
  );
}
