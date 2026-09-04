import { MaterialsLibrary } from "@/components/materials-library";
import { materialCategories, finishNotes } from "@/lib/data/materials";

export function AboutMaterialsSection() {
  return (
    <section id="materials" className="scroll-mt-24 border-t border-line py-section">
      <div className="container-edge">
        <p className="label mb-6">Curated Quality</p>
        <h2 className="display-md max-w-display">Materials, finishes &amp; hardware</h2>
        <p className="body-text mt-6 max-w-body">
          Selected core boards, durable surface finishes, and certified hardware engineered for longevity.
        </p>

        <div className="mt-12 md:mt-16">
          <MaterialsLibrary categories={materialCategories} />
        </div>

        <div className="mt-12 border-t border-line pt-10 md:mt-16">
          <p className="label mb-8">Finish Character</p>
          <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-5">
            {finishNotes.map((f) => (
              <div key={f.name} className="bg-paper p-5 md:p-6">
                <p className="font-display text-lg">{f.name}</p>
                <p className="mt-1 text-xs text-ink-muted">{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
