import Link from "next/link";
import { processSteps } from "@/lib/data/process";

export function AboutProcessSection() {
  return (
    <section id="process" className="scroll-mt-24 border-t border-line py-section">
      <div className="container-edge">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4 md:sticky md:top-32 md:self-start">
            <p className="label mb-6">Process</p>
            <h2 className="display-md max-w-editorial">From concept to handover</h2>
            <p className="body-text mt-6 max-w-body">
              Our systematic nine-step framework for smooth, stress-free interior delivery.
            </p>
            <Link href="/contact" className="btn-outline mt-8 inline-block">
              Start a Project
            </Link>
          </div>

          <ol className="md:col-span-8">
            {processSteps.map((step) => (
              <li key={step.number} className="grid gap-4 border-t border-line py-8 md:grid-cols-[5rem_1fr] md:gap-8 md:py-10">
                <span className="font-display text-[clamp(1.5rem,3vw,2rem)] text-ink-faint">{step.number}</span>
                <div>
                  <p className="label mb-2 text-ink-faint">{step.verb}</p>
                  <h3 className="font-display text-xl md:text-2xl">{step.title}</h3>
                  <p className="body-text mt-3 max-w-body">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
