# Your data warehouse

**Phase 2 — Build what needs to exist · 3–4 weeks · from-price**

> Site slug: `single-source-of-truth` (kept for URL stability after the rename from
> "One version of the truth").

## Positioning

For the organisation where three departments carry three revenue figures, and every
monthly meeting opens with an argument about whose number is right.

This is the core engineering package: from scattered sources to one modelled data
warehouse, with reporting on top that people actually trust. Everything in version
control, everything tested, everything documented — built so the client's team takes
it over instead of depending on me.

**Promise:** One data warehouse that all your reporting runs on — and no more
arguments about whose figure is right.

**Bridge:** Built so AI can go on top of it later — no rebuild needed. The warehouse
is the data foundation the AI packages assume.

## Deliverables

### 1. The modelled data warehouse — the core artifact

- Pipelines on the client's own sources, a layered model (staging → business logic →
  presentation), and a warehouse that's ready every morning.
- When the [Data scan](data-scan.md) has run, the warehouse implements its target
  data model — the scan's to-be document is the blueprint, not a new design phase.
- **Tested transformations** — a test at every step, plus daily data-quality checks
  that catch the problem before the monthly meeting does.
- Everything in version control from day one.

### 2. Definitions and reporting

- **One definition per figure**, pinned down in documentation — the warehouse
  enforces the definition; the argument about whose number is right ends because
  there is only one number. Reuses the KPI definitions from
  [Sharpen the question](requirements-and-kpis.md) when they exist.
- **A Power BI dashboard on the KPIs**, with drill-down into the detail the
  questions are really about.

### 3. Handover

- Documentation covering the model, the definitions, and how to extend it.
- A handover session with the team, and the keys. From here they carry on
  themselves.

## The engagement

| When | Activity |
|---|---|
| Week 1 | Model: pin down the definitions — what counts as a customer, when an order counts, which KPIs are steered on. That becomes the data model |
| Week 2 | Build: pipelines on the sources, transformations with a test at every step, a warehouse ready every morning |
| Week 3 | Dashboard: reporting on the KPIs, drill-down into the detail |
| Week 4 | Handover: documentation, session with the team, the keys |

## Explicitly out of scope

- Keeping the reports running and monitored over time — that's
  [Reporting on autopilot](reporting-automation.md), on top of this warehouse.
- The AI applications themselves — the warehouse makes them possible;
  [AI prototype](ai-prototype.md) builds them.

## Bridges

- Consumes phase 1 directly: the [Data scan](data-scan.md)'s target model as the
  blueprint, and [Sharpen the question](requirements-and-kpis.md)'s definitions as
  the model's business logic. Week 1 shrinks when those documents exist.
- The explicit prerequisite-solver for the AI packages: when the
  [Data scan](data-scan.md)'s AI-readiness assessment says "not yet, fix the
  foundation first", this is the package that fixes it.
- Proof: the open-data-warehouse project demonstrates this package end to end.
