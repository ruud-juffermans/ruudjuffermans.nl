# Plan — aligning the package pages with the definition docs

> **Status:** A1–A4 and the section-B copy pass are implemented (both locales,
> build verified). Open: the section-C decisions (footer link, phase connective
> line, proof slots for the scans).

The definition docs (`docs/packages/`) now say more than the site shows. The detail
page template (`client/src/app/[locale]/services/[slug]/page.tsx`) renders: intro,
recognise/promise, a flat deliverables list (+ bridge line), duration/price card,
steps, CTA. Four things from the docs have no home on the site yet:

1. the named **core artifact** (the technical document/warehouse/prototype you leave behind),
2. the explicit **out-of-scope** list,
3. the **bridges** — which package feeds which,
4. Sharpen the question's **two entry modes**.

## A. Template upgrades (built once, all 8 pages benefit)

**A1 — Grouped deliverables with a core artifact.**
Detail pages switch from one flat bullet list to the docs' grouped structure: the
core artifact as a visually led block (accent border, its own sub-bullets), the
remaining groups beneath. Cards everywhere else keep the flat 4–5 bullets — the
seven-slot comparability is the brand; depth belongs on the detail page.
*Schema:* optional `deliverableGroups: [{ title, items[] }]` per package in the
JSON; falls back to the flat `deliverables` when absent.

**A2 — "Not included" section.**
Rendered after the deliverables with ✕-style icons. This is trust-building copy —
it matches the "honest, including 'not yet'" voice the packages already use.
*Schema:* optional `notIncluded: string[]`.

**A3 — "Where this fits" section.**
A band near the bottom of each detail page with 2–3 mini-cards: what naturally
comes before this package and what it feeds. Data lives in `packages.ts` as
relations (`consumes: slug[]`, `feeds: slug[]`) so the links stay type-safe; the
one-line explanations ("the build starts from the scan's target model") come from
the JSON.

**A4 — Entry modes block (Sharpen the question only).**
A two-column comparison — *on top of scans* (± 2 weeks, reduced price) vs
*standalone* (3–4 weeks) — rendered between hero and deliverables. Optional
`modes` object in the JSON; only this package defines it.

## B. Copy pass per package (both locales)

| Package | Main deltas from the docs |
|---|---|
| **Data scan** | Deliverables regrouped: ① as-is data model document (source inventory, entity models, cross-system map, data flows, quality findings) ② target model + gap analysis + sequenced plan ③ maturity score, AI-readiness, quick wins. Not-included: building, process analysis, requirements. Fits: feeds warehouse, dashboards, AI prototype; pairs with process scan. |
| **Process scan** | Deliverables regrouped: ① as-is process model (BPMN-style diagrams, touchpoints, effort, failure points) ② opportunity map with the three verdicts + target sketches ③ shortlist + quick wins. Not-included: building the automations, data landscape, re-engineering. Fits: feeds AI prototype and reporting automation; pairs with data scan. |
| **Sharpen the question** | Entry-modes block (A4). Deliverables regrouped: ① requirements definition (decision inventory, functional reqs, acceptance criteria, out-of-scope list) ② KPI definitions (owner, formula, source mapping, measurability) ③ scoped data + process models ④ build estimate. Site bullets today still show the pre-restructure five. Fits: after the scans, feeds all of phase 2. |
| **Dashboards** | Smaller delta: bullets mostly align. Add the escalation honesty ("if the source turns out too fragmented, we stop and say warehouse first") to intro or not-included. Fits: consumes scan + brief; escalates to warehouse. |
| **Your data warehouse** | Add "implements the data scan's target model — the blueprint, not a new design phase" to the intro/steps. Not-included: ongoing monitoring (→ reporting automation), the AI applications (→ prototype). Fits: the prerequisite-solver when AI-readiness says "not yet". |
| **AI prototype** | Add to the go/no-go bullet: a "don't" names what would turn it into a "go". Not-included: production hardening, fixing the data foundation, team training. Fits: use case comes pre-scoped from process scan / brief; "don't because of data" feeds warehouse. |
| **Reporting on autopilot** | Add "more reliable than the manual version, not just faster" (tests where it breaks today). Not-included: redesigning content, consolidating sources. Fits: fed by process scan; runs on the warehouse but doesn't require it. |
| **AI workshop** | Add intake mention ("tailored, prepared in a short intake"). Not-included: building use cases, formal legal advice. Fits: standalone entry point; use-case list feeds process scan and prototype. |

## C. Smaller site alignments

- **Footer** links four packages; decide whether process scan joins them.
- **Services page phase subtitles** could each get one "phase 1 produces documents,
  phase 2 builds from them" connective line — currently the path logic is implicit.
- **Proof slots**: data scan and process scan have no `proofSlug`. Option: point
  both at open-data-warehouse until a scan case exists, or leave empty.

## D. Sequencing

1. Schema + template (A1–A4) with fallbacks, so nothing breaks while copy lands.
2. Phase-1 copy (biggest deltas: both scans + sharpen).
3. Phase-2/3 copy (small deltas).
4. Relations in `packages.ts` + "Where this fits" copy.
5. Footer/services-page touches, then a full bilingual read-through.

Estimated shape: one template PR, one copy PR per phase.
