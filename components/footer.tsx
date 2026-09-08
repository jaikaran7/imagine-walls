import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { siteSettings } from "@/lib/data/site";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer data-site-chrome className="rule mt-section pb-12 pt-section-sm">
      <div className="container-edge">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandLogo height={48} />
            <p className="body-text mt-4">
              Interior Design Studio · {siteSettings.location}
            </p>
            <p className="mt-8 font-display text-[clamp(1.125rem,2vw,1.375rem)] italic text-ink-muted">
              &ldquo;{siteSettings.dreamLine}&rdquo;
            </p>
          </div>

          <div>
            <p className="label mb-6">Navigate</p>
            <ul className="flex flex-col gap-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="body-text transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label mb-6">Contact</p>
            <ul className="flex flex-col gap-3 body-text">
              <li>
                <a href={siteSettings.whatsappHref} className="transition-colors hover:text-ink" target="_blank" rel="noreferrer">
                  WhatsApp {siteSettings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteSettings.email}`} className="transition-colors hover:text-ink">
                  {siteSettings.email}
                </a>
              </li>
              <li>
                <a href={siteSettings.instagramHref} className="transition-colors hover:text-ink" target="_blank" rel="noreferrer">
                  {siteSettings.instagram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Imagine Walls. All rights reserved.</p>
          <p>{siteSettings.positioning}</p>
        </div>
      </div>
    </footer>
  );
}
