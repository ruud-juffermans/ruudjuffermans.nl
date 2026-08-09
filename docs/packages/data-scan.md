# Data scan

**Phase 1 — Know where you stand · 1–2 weeks · fixed price**

## Positioning

The entry package. For the organisation that knows there's more in its data than it's
getting out of it, but not where to start — and that meanwhile is being asked "what are
we doing with AI?" without a grounded answer.

The data scan answers both questions in one to two weeks: *what do you actually have*
(a technical current-state data model) and *what should it become* (a target data
model with a plan to get there). The AI question is answered as a consequence of the
model: AI readiness is a property of your data landscape, not a separate opinion.

**Promise:** Within two weeks you know exactly what your data landscape looks like,
the improvements and what these improvements can bring.

## Deliverables

### 1. Current-state data model document (as-is) — the core artifact

A technical document describing the data landscape as it actually is, verified by
looking inside the systems — not by interviewing people about what should be there.

Contents:

- **Source inventory** — every data source, with per source: the system and vendor,
  the business owner, how it's accessed (API, export, database, spreadsheet), refresh
  cadence, and approximate volume.
- **Entity model per source** — the core entities (customer, order, product, case, …)
  and their key fields, as they exist in each system.
- **Cross-system entity map** — an ERD-style diagram showing how the same real-world
  entity lives in multiple systems, which identifiers (fail to) link them, and where
  the same concept has conflicting definitions.
- **Data flows** — how data moves between systems today: integrations, manual exports,
  retyping. Each flow marked as automated, semi-manual, or manual.
- **Quality findings** — per source: completeness, duplicates, staleness, and the
  fields that look reliable but aren't.

### 2. Target data model & plan (to-be)

- **Target model** — a conceptual/logical data model of where the landscape should go:
  which entities get a single authoritative home, how sources connect, what a shared
  reporting layer looks like.
- **Gap analysis** — the concrete distance between as-is and to-be, itemised.
- **Sequenced plan** — the gaps ordered into a twelve-month roadmap, each step with an
  estimate of effort and what it unlocks.

### 3. Assessment & priorities

- **Maturity score** — where the organisation stands, on a scale that can be re-scored
  later to show progress.
- **AI-readiness assessment** — derived from the model: which AI applications the
  current landscape can realistically support today, which ones need specific gaps
  closed first, and which are hype for this organisation. Honest, including "not yet".
- **2–3 quick wins** — improvements the team can implement itself this month, without
  me.

## The engagement

One week for a small landscape (a handful of sources), two when there's more to
model. Fixed price either way, agreed up front.

| When | Activity |
|---|---|
| Week 1 | Conversations with the people who work with the data and the people who steer on it |
| Week 1 | Inside the systems: building the as-is model from what's actually there |
| Week 2 | Working it out: target model, gap analysis, maturity score, AI readiness, costing the roadmap steps |
| Week 2 | Delivery: documents handed over, quick wins identified |

## Explicitly out of scope

- Building anything (pipelines, dashboards, integrations) — that's phase 2.
- Process analysis — how *work* flows is the [Process scan](process-scan.md); this
  package models how *data* flows.
- Requirement and KPI definitions — that's [Sharpen the question](requirements-and-kpis.md).

## Bridges

- The as-is/to-be data model feeds directly into **Single source of truth** and
  **Dashboards** (phase 2) — the build starts from this document instead of a new
  discovery phase.
- The AI-readiness assessment feeds **AI prototype**: the prototype candidates come
  from here.
- Pairs naturally with the **Process scan**; together they cover the full picture
  (data + work). Consider a combined price for both scans.
