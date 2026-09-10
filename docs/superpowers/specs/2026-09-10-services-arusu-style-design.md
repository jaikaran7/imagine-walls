# Services pages — Arusu layout, Imagine Walls brand

**Date:** 2026-09-10  
**Status:** Approved in chat (brand: B, data: A, approach: hybrid)  
**Site:** Imagine Walls

## Goal

Rebuild the full services journey (`/services` → `/services/[slug]`) to match Arusu Aus Garden Care’s structure and motion, using Imagine Walls brand tokens (colors, typography, nav, footer). Replace the current six services with exactly four interior services. Keep services as code data (no new services table).

## Decisions

| Topic | Choice |
| --- | --- |
| Visual language | Arusu layout/motion; Imagine Walls CSS tokens (`--paper`, `--ink`, `--surface`, display/body type) |
| Data | Static code in `lib/data/*` (same pattern as Arusu) |
| Approach | Hybrid: port hero slider animation from reference; rebuild sticky list + detail to fit site shell |
| Footer / nav | Keep existing Imagine Walls `Nav` and `Footer` / `SiteFooter` |
| Admin services CRUD | Out of scope |

## Four services (canonical)

| # | Slug | Title | Short description |
| --- | --- | --- | --- |
| 01 | `residential-interiors` | Residential Interiors | Complete interior solutions for homes, including living spaces, dining areas, bedrooms, kitchens, and bespoke storage. |
| 02 | `commercial-interiors` | Commercial Interiors | Professional interiors for offices, executive spaces, receptions, retail environments, and other commercial properties. |
| 03 | `kitchens-custom-joinery` | Kitchens & Custom Joinery | Custom kitchens, wardrobes, cabinetry, TV units, feature walls, and built-in storage designed around the space. |
| 04 | `lighting-architectural-details` | Lighting & Architectural Details | False ceilings, lighting design, feature walls, architectural detailing, and finishing elements that complete the interior. |

Old slugs removed from public routes and cross-links: `modular-kitchens`, `bedrooms-wardrobes`, `tv-units-feature-walls`, `false-ceiling-lighting` (and any category accordion items that pointed at them).

## Page architecture

### `/services` (listing)

1. **Hero slider** (port from `reference/landscaping-asu-main/.../ServicesHeroSlider.tsx`)
   - Full-viewport background image for active service
   - Tag, title, short description, “Discover service” CTA → `/services/[slug]`
   - Bottom thumbnail strip with index (`n / 4`), progress, next control
   - Same queue / backward-zoom / autoplay / mobile swipe behavior as reference
   - Restyled with Imagine Walls tokens (no Arusu lime/gold)

2. **Sticky expertise stack** (port structure from reference `Services.tsx`)
   - Section intro (“Our Expertise” or Imagine Walls–toned equivalent) + short supporting copy
   - One sticky full-viewport split per service: text | image, alternating sides
   - “Read more →” → `/services/[slug]`
   - Uses Imagine Walls type scale and link styles

3. **Chrome**
   - Site layout already provides nav + footer; do not mount Arusu Header/Footer
   - Services page content should sit cleanly under existing site shell

### `/services/[slug]` (detail)

Mirror Arusu `ServiceDetailContent` structure:

- Hero image + title
- Intro copy (expanded from short description; interior-focused)
- What’s included / features list
- Image gallery (reuse stock images per service until custom assets exist)
- Related projects (filter existing projects by `relatedProjectSlugs` and/or matching `servicesInvolved`)
- CTA into existing enquire / contact flow (reuse Imagine Walls enquiry panel pattern, not Arusu FAB pair unless already present site-wide)

Keep Imagine Walls motion helpers (`ImageMotion`, etc.) where they fit without fighting the Arusu detail layout.

## Data model (code)

Extend / replace `lib/data/services.ts` as the single source of truth for:

- `slug`, `number`, `title`, `tag` (hero eyebrow), `shortDescription`, `fullDescription` / `intro`
- `heroImage`, `gallery[]`
- `features` (label + description or bullet strings matching detail UI)
- `relatedProjectSlugs`

Update dependents:

- `lib/types.ts` — `Service` shape if needed (`tag`, `gallery`)
- `lib/data/service-categories.ts` — either remove accordion categories or retarget to the four services
- `lib/data/home-services.ts` — align homepage preview to the four (or a subset) with valid hrefs
- `app/sitemap.ts` — generate from new four only
- Admin / project form `servicesInvolved` suggestions if any hardcode old names
- Seed / static project `servicesInvolved` arrays — map old labels to the new four where sensible

**Database:** No new `Service` / `AdminService` table. Only update JSON `services_involved` values on projects (seed + any migration of string labels) so admin project tags match the new four names/slugs. Prisma schema stays as-is unless a tiny seed-only change is required.

## Images

Reuse existing Imagine Walls stock interiors from `lib/images` / public assets for heroes, thumbnails, and galleries. No dependency on Arusu landscaping image paths. Placeholder quality is acceptable until the client supplies final photography.

## Amendments (2026-09-10)

- Skip formal implementation-plan docs; implement directly from this spec.
- Mobile must match Arusu services UX (hero carousel + sticky list + detail), not desktop-only.
- Homepage: wherever services appear, use the same Arusu-style hero slider animation/experience as `/services` (Arusu home mounts `ServicesHeroSlider`).
- Fix mobile project title overlap on project detail (duplicate title layers).

## Out of scope

- Building admin UI to edit services
- Copying Arusu Header, Footer, or floating phone/email FABs
- Keeping redirects for deleted service slugs (404 via `notFound()` is fine unless we later add redirects)

## Success criteria

- `/services` visually and interactively matches Arusu listing (hero animation + sticky splits), in Imagine Walls brand
- Each of the four “Read more” / “Discover” paths opens a detail page with the same content blocks as Arusu detail
- Footer and nav remain Imagine Walls
- No public references to the six old services
- Project `servicesInvolved` and related links use the new four only
- Mobile: hero and sticky sections usable; reduced-motion respected where site already does

## Testing

- Manual: desktop + mobile walkthrough of listing → each detail → enquire CTA
- Confirm old slugs 404
- Confirm sitemap lists only four service URLs
- Smoke: `npm run build` (or typecheck) after data/type updates
