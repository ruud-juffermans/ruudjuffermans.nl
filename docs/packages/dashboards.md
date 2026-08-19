# A dashboard people actually open

**Phase 2 — Build what needs to exist · 2–3 weeks · from-price**

## Positioning

For the organisation whose data already sits somewhere usable, and that mostly wants
something to finally come out of it that people look at. There's a dashboard nobody
opens — or the data sits in the system, but "how are we doing" still means calling
Finance.

No warehouse project needed: the build goes directly on the source that's already
there. Most dashboards don't die on technology, they die on use — so the package is
built around the decisions the team actually makes, and the adoption session is in
scope by default, not an optional extra.

**Promise:** Dashboards built around the decisions your team actually makes — on the
source you already have.

## Deliverables

### 1. Decision inventory

- The recurring decisions the dashboard must serve — not "which chart do you want"
  but "which decision do you make again every month". Each dashboard view traces to
  one of these.
- When the [Data scan](data-scan.md) has run, this is its decision
  inventory, reused as-is.

### 2. Data model on the existing source

- A clean, documented model on the source that's already there — staging, business
  logic, and presentation kept apart so a figure is defined once, not per chart.
- **Definition list** — one definition per figure shown, so every number on screen
  traces back to source fields. Reuses the KPI definitions from the
  [Data scan](data-scan.md) when they exist.
- When the [Data scan](data-scan.md) has run, the model follows its target data
  model; standalone, a scoped version is drawn first.

### 3. The dashboards

- 1–3 dashboards with drill-down into the detail the questions are actually about.
- Built iteratively — the users look along during the build; no single big reveal at
  the end.

### 4. Adoption

- A working session with the people who'll use it, in their own calendar — a manual
  by email doesn't work.
- The definition list handed over as the reference for "what does this figure mean".

## The engagement

| When | Activity |
|---|---|
| Week 1 | Mapping the decisions: which decision comes back every month; the dashboard gets built around that |
| Week 1–2 | Model on the source: clean data model on what's already there, one definition per figure |
| Week 2–3 | Build and sharpen: the dashboards with drill-down, users looking along as it goes |
| Closing | Adoption session with the users |

## Explicitly out of scope

- Building a data warehouse or integrating sources — when the sources themselves are
  the problem, [Your data warehouse](data-warehouse.md) is the right
  package, not this one.
- Ongoing report distribution and monitoring — that's
  [Reporting on autopilot](reporting-automation.md).

## Bridges

- Consumes phase 1 directly: the decision inventory, KPI definitions, and data
  model from the [Data scan](data-scan.md), when it has run — the build starts
  from documents instead of a new discovery.
- If during week 1 the source turns out too fragmented for a direct build, the
  finding escalates honestly to [Your data warehouse](data-warehouse.md)
  instead of building on sand.
