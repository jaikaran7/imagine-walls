import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { siteSettings } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Imagine Walls — interior design studio in Hyderabad.",
};

const channels = [
  { label: "WhatsApp", value: siteSettings.phone, href: siteSettings.whatsappHref },
  { label: "Email", value: siteSettings.email, href: `mailto:${siteSettings.email}` },
  { label: "Instagram", value: siteSettings.instagram, href: siteSettings.instagramHref },
  { label: "Location", value: siteSettings.location, href: undefined },
];

export default function ContactPage() {
  return (
    <div>
      <section className="section-dark py-section">
        <div className="container-edge">
          <p className="label mb-10">Contact</p>
          <h1 className="display-lg max-w-display">
            Let&rsquo;s talk about <span className="italic">your space.</span>
          </h1>
          <p className="body-text mt-8 max-w-body">&ldquo;{siteSettings.dreamLine}&rdquo;</p>
        </div>
      </section>

      <div className="container-edge py-section">
        <div className="grid gap-16 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-4">
            <p className="label mb-8">Reach us</p>
            <div className="flex flex-col gap-8">
              {channels.map((c) => (
                <div key={c.label} className="border-t border-line pt-4">
                  <p className="label mb-1">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                      className="font-display text-lg transition-opacity hover:opacity-60"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="font-display text-lg">{c.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
