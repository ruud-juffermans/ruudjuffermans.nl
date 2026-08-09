# Sharpen the question (requirements & KPIs)

**Phase 1 — Know where you stand · 3–4 weeks (2 weeks on top of scans) · fixed price**

## Positioning

For the organisation that has budget for a dashboard or a system, but where the
question behind it isn't written down anywhere — and everyone means something
different by "active customer".

This is the specification package: it turns an intention into something buildable.
Where the two scans are *broad* (the whole data landscape, the key processes), this
package is *deep*: it takes one concrete goal and produces everything needed to build
it right — the requirements, the KPI definitions, and the technical models scoped to
this solution.

Requirements and KPIs can only be defined against knowledge of what's actually in the
data and how the work actually runs. That knowledge either already exists — because
the [Data scan](data-scan.md) and/or [Process scan](process-scan.md) have run — or
this package builds it first, focused on the one solution being specified. Hence the
two entry modes below.

**Promise:** A specification that can be built from directly — requirements, KPI
definitions everyone stands behind, and the data and process models to back them —
usable by me or by anyone else.

## Two entry modes

| | On top of scans | Standalone |
|---|---|---|
| **Starting point** | Scan documents on the table | No prior discovery |
| **Discovery** | Already done — read, not redone | Focused discovery: only the sources and processes this solution touches |
| **Duration** | ± 2 weeks | 3–4 weeks |
| **Price** | Reduced — the client doesn't pay twice for discovery | Full |

The recommended path is scans first: the scan says what to do first, this package
specifies it to buildable depth, and the price difference makes the scans feel like
credit rather than a toll. But standalone stays possible on purpose — a client who
walks in with a concrete ask ("we have budget for a dashboard, help us specify it")
shouldn't have to buy two scans before getting a spec.

## Deliverables

### 1. Requirements definition

- **Decision inventory** — the decisions the solution must support, who makes them,
  and what goes wrong today when they can't.
- **Functional requirements** — what the solution must do, per user role, written so
  a builder can build from them and a buyer can accept against them.
- **Acceptance criteria** — when is it done and right, verifiable per requirement.
- **Explicit out-of-scope list** — what is deliberately not included, on paper, so
  scope creep has to be a decision instead of an accident.

### 2. KPI definitions

- **One definition per KPI, with an owner** — what counts, what doesn't, the exact
  formula, and who decides when it's contested.
- **Source mapping** — per KPI, the fields and systems it's computed from.
- **Measurability check** — verified inside the sources: can this KPI actually be
  populated with the data as it exists? A KPI nobody can populate isn't a KPI, and
  you'd rather hear that now than after the build.

### 3. Scoped technical models

The solution's slice of what the scans produce landscape-wide:

- **Data model (scoped)** — the logical model for this solution: entities, keys,
  source fields, and the transformations from source to KPI. In *on top of scans*
  mode this refines the [Data scan](data-scan.md) document; standalone, it's built
  during the focused-discovery weeks for just the sources this solution touches.
- **Process model (scoped)** — where the solution lands in the workflow: who acts on
  which number, when, and what happens next. Same rule: refines the
  [Process scan](process-scan.md) document when it exists, otherwise built focused.

### 4. Build estimate

- Effort and cost estimate for the build, structured so it can go out to tender —
  the brief is the client's, not mine, and holds up whether I build it or someone
  else does.

## The engagement

Standalone runs all four weeks; on top of scans, the discovery weeks are already done
and the engagement starts at "pinning down definitions".

| When | Activity | On top of scans |
|---|---|---|
| Week 1 | Collecting the question: users and budget-holder; which decisions, what goes wrong today | compressed into week 1 |
| Week 2 | Focused discovery: inside the sources and alongside the process this solution touches | skipped — the scan documents cover it |
| Week 3 | Pinning down definitions: KPIs, owners, contested terms settled; measurability verified; scoped models drawn | week 1–2 |
| Week 4 | The brief: requirements, definitions, models, acceptance criteria, build estimate | week 2 |

## Explicitly out of scope

- Building the solution — phase 2 exists for that, and the brief works without me.
- Landscape-wide modelling — the scoped models cover this solution only; the full
  picture is what the [Data scan](data-scan.md) and [Process scan](process-scan.md)
  are for.

## Bridges

- The natural step *after* a scan: the scan says what to do first, this package
  specifies it to buildable depth — and enters in the shorter, cheaper mode.
- Feeds every phase-2 package: **Dashboards**, **Single source of truth**, and
  **AI prototype** all start from this brief when it exists.

## Design note — why not "both scans plus requirements"?

Delivering the *complete* data model and process model here would make this package a
superset of both scans, which (a) undercuts them, (b) doesn't fit the timeline, and
(c) buries the actual product — the buildable spec — under landscape documentation.
The dependency on scan-level knowledge is real, but it's satisfied either by the scan
documents (entry mode 1) or by focused discovery (entry mode 2) — never by redoing
the full landscape work. That keeps each package distinct:

| Package | Breadth | Depth | Duration | Core artifact |
|---|---|---|---|---|
| Data scan | whole data landscape | survey | 1–2 weeks | as-is/to-be data model |
| Process scan | key processes | survey | 1–2 weeks | as-is process model + opportunity map |
| Sharpen the question | one goal | buildable | 3–4 weeks (2 on top of scans) | requirements + KPIs, models scoped to fit |
