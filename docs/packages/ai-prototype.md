# AI prototype in 3 weeks

**Phase 2 — Build what needs to exist · 3 weeks · fixed price**

## Positioning

For the organisation with an AI idea on the table that nobody can vouch for: does it
work, what does it cost, is it worth doing?

Three weeks, one use case, and an honest answer at the end. The prototype is built
for real — working software on the client's data, in their environment, not a
clickable mockup — and measured against a test set that was agreed before the first
line of code. If the verdict is "don't", that's the deliverable working as intended:
for a fixed price the client has avoided sinking a year into it.

**Promise:** From AI idea to working prototype — including an honest verdict on
whether it should go ahead.

## Deliverables

### 1. The yardstick — agreed before building starts

- **One use case, tightly scoped** — picked from the
  [Process scan](process-scan.md)'s opportunity map or the
  [Sharpen the question](requirements-and-kpis.md) brief when they exist; scoped in
  week 1 otherwise.
- **A real test set** — what "good enough" means, in examples, built with the people
  who do the work today. The go/no-go is measured against this, not against a demo
  that went well.

### 2. Working software

- The prototype on the client's data, in the client's own environment — no data
  leaves the house.
- **With citations** — every answer traces back to its source, so the people
  checking it can check it.

### 3. The verdict

- **Measured quality** against the test set — a number, not a gut feeling.
- **Cost per user per month, worked out** — what this costs when it's real, not
  what the demo cost.
- **A go/no-go recommendation with the reasoning attached** — including when that's
  "don't". The reasoning names what would have to change for a "don't" to become a
  "go" (better data, narrower scope, different model), so even a no is actionable.

## The engagement

| When | Activity |
|---|---|
| Week 1 | Scope and yardstick: one use case, tightly scoped, and the test set built before the first line of code |
| Week 2 | Building: working software on the client's data, in their environment, with citations |
| Week 3 | Measure and judge: quality against the test set, cost per user per month, go/no-go with reasoning |

## Explicitly out of scope

- Production hardening, SSO, scaling — the prototype proves the case; the production
  build is its own (phase 2/3) engagement, scoped by the prototype's findings.
- Fixing the data foundation the prototype reveals to be missing — that's
  [Your data warehouse](data-warehouse.md).
- Teaching the wider team to work with AI — that's the
  [AI workshop](ai-workshop.md).

## Bridges

- Consumes phase 1 directly: the use case comes pre-scoped from the
  [Process scan](process-scan.md)'s AI-fit shortlist or the
  [Data scan](data-scan.md)'s AI-readiness assessment; the
  [Sharpen the question](requirements-and-kpis.md) brief, when it exists, supplies
  the acceptance criteria the test set is built from.
- A "go" verdict feeds the production build; a "don't because of the data" verdict
  feeds [Your data warehouse](data-warehouse.md).
- Proof: the uitspraak-rag project demonstrates this package end to end.
