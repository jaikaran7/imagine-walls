import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <MediaImage
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-[transform,filter] duration-700 ease-editorial group-hover:scale-[1.04] group-hover:blur-[6px]"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/45" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="rounded-full border border-white/35 bg-black/35 px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            View Project
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3 border-t border-line pt-3">
        <div>
          <h3 className="font-display text-xl leading-tight">{project.title}</h3>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-ink-muted">
            {project.category} &middot; {project.location}
          </p>
        </div>
        <span className="shrink-0 text-xs text-ink-faint">{project.year}</span>
      </div>
    </Link>
  );
}
