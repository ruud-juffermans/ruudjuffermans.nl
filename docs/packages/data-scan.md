# Data scan

**Phase 1 — Know where you stand · 1–2 weeks · fixed price**

## Positioning

The entry package. For the organisation that has the data — in its systems, its
exports, its spreadsheets — but not the insights. Reporting, where it exists, is
pieced together by hand in Excel; the numbers depend on who made the file; and
everyone senses there's more in the data than the organisation is getting out of it,
without knowing where to start.

The data scan answers that in one to two weeks: *what do you actually have* (an
inventory of every data source and where the figures are made today), *how good is
it* (quality findings per source), *what should it become* (a target architecture
with requirements and acceptance criteria), and *what the numbers mean* — one
definition per KPI.

**Promise:** Within two weeks you know exactly what data you have and how reliable
it is, have a target architecture with requirements and acceptance criteria you can
build or tender from, and know what to tackle first.

## Deliverables

### 1. Source inventory — the map of the data landscape (as-is)

The core artifact, built by looking inside the systems — not by interviewing people
about what should be there.

- **Inventory of every data source** — per source: the system and vendor, the
  business owner, how it's accessed (API, export, database, spreadsheet), refresh
  cadence, and approximate volume.
- **Data flows** — how data moves between systems today: integrations, manual
  exports, retyping. Each flow marked as automated, semi-manual, or manual.
- **Where the figures are made today** — the Excel files, exports and hand-built
  overviews that carry the current reporting, and who maintains them.

### 2. Data quality findings

- **Per source** — completeness, duplicates, staleness.
- **The fields that look reliable but aren't** — verified inside the systems.
- **Cross-system entity check** — how the same real-world entity (customer, order,
  product, case, …) lives in multiple systems, and which identifiers (fail to)
  link them.

### 3. Target architecture, requirements & acceptance criteria (to-be)

- **Target architecture** — where the landscape should go: one authoritative home
  per entity, one shared reporting layer instead of loose Excel files.
- **Metrics-layer design** — every figure computed once, in one place, instead of
  per overview — the paper design the KPI definitions plug into.
- **Functional requirements & acceptance criteria** — what the reporting solution
  must do, per user role, written so a builder can build from them and a buyer can
  accept against them — with an explicit out-of-scope list, so scope creep has to
  be a decision instead of an accident.
- **Gap analysis & sequenced plan with build estimate** — the concrete distance
  between as-is and to-be, itemised and ordered into a twelve-month roadmap, each
  step with an effort and cost estimate structured so it can go out to tender —
  the brief is the client's, not mine, and holds up whether I build it or someone
  else does.

### 4. KPI definitions

The question behind the build, pinned down against what's actually in the sources:

- **Decision inventory** — the decisions the numbers must support, who makes them,
  and what goes wrong today when they can't.
- **One definition per KPI, with an owner** — what counts, what doesn't, the exact
  formula, and who decides when it's contested.
- **Source mapping & measurability check** — per KPI, the fields and systems it's
  computed from, verified inside the sources: can this KPI actually be populated
  with the data as it exists? A KPI nobody can populate isn't a KPI, and you'd
  rather hear that now than after the build.

### 5. Assessment & priorities

- **Maturity score** — where the organisation stands, on a scale that can be re-scored
  later to show progress.
- **2–3 quick wins** — improvements the team can implement itself this month, without
  me.

## The engagement

One week for a small landscape (a handful of sources), two when there's more to
model. Fixed price either way, agreed up front.

| When | Activity |
|---|---|
| Week 1 | Conversations with the people who put the figures together today and the people who steer on them: which decisions the numbers must support, where the definitions diverge |
| Week 1 | Inside the systems — and inside the Excel files where the reporting happens today: building the source inventory and quality findings from what's actually there |
| Week 2 | Working it out: target architecture, requirements and acceptance criteria, KPI definitions verified against the sources, gap analysis, maturity score, costing the roadmap steps |
| Week 2 | Delivery: the full documentation handed over, quick wins identified |

## Explicitly out of scope

- Building anything (pipelines, dashboards, integrations) — that's phase 2.
- Process analysis — how *work* flows is the [Process scan](process-scan.md); this
  package models how *data* flows.

## Bridges

- The source inventory, the target architecture with its requirements, and the KPI
  definitions feed directly into **Single source of truth** and **Dashboards**
  (phase 2) — the build starts from this document instead of a new discovery phase,
  and the definitions become the model's business logic.
- Pairs naturally with the **Process scan**; together they cover the full picture
  (data + work). Consider a combined price for both scans.
