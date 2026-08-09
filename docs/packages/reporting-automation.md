# Reporting on autopilot

**Phase 3 — Keep it running · 1–2 weeks · fixed price**

## Positioning

For the organisation that loses the same two days every month: pull the exports,
paste into Excel, re-check the figures, and hope nothing slipped.

The smallest package, and often the one that pays back fastest. One report that's
manual today becomes a pipeline that runs itself — including an alert when something
goes wrong, so a broken report is caught before the stakeholders notice.

**Promise:** That monthly report costing two days of manual work? From now on it
runs itself.

**Bridge:** Built so AI can go on top of it later — no rebuild needed.

## Deliverables

### 1. The automated pipeline — the core artifact

- The report's manual steps turned into code: fetch, validate, calculate, publish.
- **Tests exactly where it goes wrong today** — the small corrections nobody writes
  down become explicit validations, so the pipeline is more reliable than the manual
  version, not just faster.
- Runs on the existing sources; in version control.

### 2. Delivery and monitoring

- The report lands in the inbox or dashboard, on schedule.
- **An alert the moment something breaks** — before the stakeholders notice. A
  report that silently shows stale numbers is worse than one that's visibly late.

### 3. Handover

- A session and documentation so the team can adjust the pipeline itself — when a
  column is added, nobody has to call me.

## The engagement

| When | Activity |
|---|---|
| Days 1–2 | Unpicking it: the report walked through step by step as it's made now — every action, including the small corrections nobody writes down |
| Week 1 | Build: the steps become code — fetch, validate, calculate, publish — with tests where it goes wrong today |
| Week 2 | Live and handover: the pipeline runs on schedule, the report arrives, the team knows how to adjust it |

## Explicitly out of scope

- Redesigning the report's content — the report is automated as it is; new KPIs or
  a new design are [Sharpen the question](requirements-and-kpis.md) +
  [Dashboards](dashboards.md) work.
- Consolidating the sources the report draws from — that's
  [Your data warehouse](data-warehouse.md).

## Bridges

- The [Process scan](process-scan.md) is this package's natural feeder: manual
  reporting chains found there arrive here already mapped — the "unpicking" step
  starts from the process model instead of from scratch.
- Runs naturally on top of [Your data warehouse](data-warehouse.md)
  when the warehouse exists, but doesn't require it.
- Proof: the open-data-warehouse project demonstrates the pipeline pattern.
