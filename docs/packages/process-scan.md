# Process scan

**Phase 1 — Know where you stand · 1–2 weeks · fixed price**

## Positioning

For the organisation where work gets retyped, checked, and forwarded by hand — and
everyone senses that automation or AI could take some of it over, but nobody knows
which part is realistic.

Where the [Data scan](data-scan.md) models how *data* flows, the process scan models
how *work* flows. The core artifact is a technical process model: the key processes
mapped step by step as they actually run, with every hand-off, system touch, and
manual action made visible. The automation and AI verdicts then follow from the model
instead of from gut feeling.

**Promise:** Within two weeks you know exactly how your key processes run, which ones
are ready for automation or AI, and which aren't yet — with requirements and a build
estimate for the top candidates.

## Deliverables

### 1. Current-state process model document (as-is) — the core artifact

A technical document modelling the 3–5 most important processes as they actually run,
built by following the work itself — not the process description in the handbook.

Contents, per process:

- **Process diagram** — BPMN-style flow: every step, decision point, and hand-off,
  with the role that performs it and the system it happens in.
- **System touchpoints** — which systems the process crosses, and where information
  is moved between them by hand (retyping, exports, copy-paste).
- **Effort profile** — frequency, time per run, and who carries it; where the hours
  actually go.
- **Failure points** — where the process stalls, errors get introduced, or work gets
  redone; what the workarounds are.

### 2. Automation & AI opportunity map (to-be)

- **Per process step, a verdict** — one of three, with reasoning:
  - *automate with standard tooling* (workflow rules, integrations, scheduled jobs),
  - *genuine fit for AI* (judgment, language, or pattern work that standard tooling
    can't do),
  - *leave to people* (too contextual, too rare, or cheaper as-is).
- **Readiness prerequisites** — what has to be in place before the AI-fit steps are
  buildable (data quality, system access, volume). Cross-referenced with the Data
  scan's model when both scans have run.
- **Target process sketches** — for the top candidates: the process redrawn with the
  automated/AI steps in place, so the end state is concrete.

### 3. Requirements & build estimate (top candidates)

For the top automation/AI candidates, the specification to act on:

- **Functional requirements & acceptance criteria** — what the solution must do, per
  user role, written so a builder can build from them and a buyer can accept against
  them — with an explicit out-of-scope list, so scope creep has to be a decision
  instead of an accident.
- **Build estimate** — effort and cost per top candidate, structured so it can go
  out to tender — the brief is the client's, not mine, and holds up whether I build
  it or someone else does.

### 4. Priorities

- **Ranked shortlist** — every opportunity ordered by effort against hours saved, so
  the sequence is defensible.
- **2–3 quick wins** — process fixes the team can implement itself this month, no
  build required.

## The engagement

One week for a couple of processes, two when more are in scope. Fixed price either
way, agreed up front.

| When | Activity |
|---|---|
| Week 1 | Sitting with the people who do the work: where the hours go, what gets retyped, which step everyone dreads |
| Week 1 | Following the work system to system: building the as-is process models |
| Week 2 | Weighing up: verdicts per step, readiness check, target sketches, requirements and build estimates for the top candidates, ranking the shortlist |
| Week 2 | Delivery: documents handed over, quick wins identified |

## Explicitly out of scope

- Building the automations or AI solutions — that's phase 2 (**AI prototype**,
  **Reporting automation**).
- Modelling the data landscape — that's the [Data scan](data-scan.md).
- Full process re-engineering or change management — the scan finds and ranks the
  opportunities; it doesn't run the transformation.

## Bridges

- The opportunity map feeds **AI prototype** directly: the prototype is the top
  AI-fit candidate from this document, already scoped — and its acceptance criteria
  are what the prototype's test set is built from.
- Manual reporting chains found here feed **Reporting automation**.
- Pairs naturally with the **Data scan** — an AI verdict is only as good as the data
  behind the process step. Consider a combined price for both scans.
