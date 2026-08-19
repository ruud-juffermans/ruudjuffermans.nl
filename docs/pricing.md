# Pricing research & recommendations — the seven packages

*Researched August 2026. Sources at the bottom; numbers ex VAT.*

> **Live discount:** phase 1 currently runs a 50% launch discount
> (`discountPrice` in `packages.ts`): scans €4.950 → €2.475, Sharpen the
> question from €7.500 → from €3.750 (standalone €12.500 → €6.250). The site
> shows the full price struck through in grey. Remove the `discountPrice`
> fields to end the promotion.

## The anchor: what your time is worth on this market

- Freelance **data engineers** in NL average **€80–130/h**; Kafka/streaming and
  MLOps skills sit at the top (€115–130+). Cloud/dbt-profile seniors €110–130/h
  at government and financial institutions.
- Freelance **BI consultants**: €65–120/h; Power BI specialists average €70–130/h,
  seniors €100–130. Typical **day rates €600–1.040**, €1.200+ for complex work.
- Your profile (senior, NLR + police background, dbt/Kafka/RAG demonstrated in
  public repos) justifies the upper-middle of that band: **~€900–1.000/day
  effective** is the fair internal anchor for pricing the packages.

The fixed prices below are built on that anchor: `expected days × ~€900`, then
adjusted for the package's role in the funnel (entry packages priced sharp, build
packages carrying the value).

## What comparable offerings cost

- **Data/AI maturity & readiness scans**: the market is polluted with free
  self-service quickscans (Data Crossroads, Infotopics, JADS MKB Datalab) used as
  lead magnets. Paid, guided scans exist though: Embed AI charges **€2.950** for a
  guided scan (creditable toward follow-up) and **€9.900 fixed** for a
  readiness sprint with inventory, gap analysis and roadmap. Your scans deliver far
  more than a questionnaire (a technical as-is/to-be model document), so they
  belong well above the free tier, but the €2.950 guided-scan price point shows
  what a lead-in engagement tolerates.
- **Power BI dashboard work (NL MKB)**: simple dashboard from ~€500–3.500; a
  serious dashboard without warehouse ≈ **€5.000**; two dashboards + three
  sources + a data warehouse ≈ **€17.500**.
- **AI prototypes / PoCs**: US-market RAG PoCs run **$20–50k** (4–8 weeks,
  agency overhead included); production RAG builds $75–180k. A 3-week solo NL
  prototype should sit well under the agency floor while capturing the same value.

## Recommended prices

| Package | Duration | Price | Effective rate check |
|---|---|---|---|
| **Data scan** | 1–2 wk | **€4.950 fixed** | ~€700–990/day — deliberately sharp: it's the entry product and the cheapest way for a client to start |
| **Process scan** | 1–2 wk | **€4.950 fixed** | same logic; identical price keeps the choice about *content*, not budget |
| *Both scans bundled* | 2–3 wk | **€8.500** | small bundle discount; sells the full picture |
| **Dashboards** | 2–3 wk | **from €7.500** | between the market's €5k no-warehouse dashboard and €17.5k warehouse scenario; adoption session included justifies the premium over €5k |
| **Your data warehouse** | 3–4 wk | **from €15.000** | ~€850/day at 3.5 wks; consistent with the €17.5k market scenario that includes dashboards |
| **AI prototype** | 3 wk | **€12.500 fixed** | ~€830/day; a fraction of agency PoC prices ($20–50k) for the same honest go/no-go |
| **Reporting on autopilot** | 1–2 wk | **€3.950 fixed** | the "smallest package, fastest payback" positioning wants the lowest number on the site |

### The ladder this creates

€3.950 → €4.950 → €7.500 → €12.500 → €15.000+. Each step is roughly 1.5–1.7× the
previous, every phase-1 price is creditable psychology toward phase 2, and no
number collides with another package's value story. (The former "Sharpen the
question" package was dissolved into the two scans: KPI definitions and
requirements now ship inside them at the same scan price.)

## Design decisions behind the numbers

1. **Show real prices.** The whole positioning is "no billing by the hour but
   defined packages… fixed timeline, fixed price". "Prijs op aanvraag" on every
   card undercuts that promise. Fixed prices also filter out non-buyers before
   the intake call.
2. **Scans priced sharp on purpose.** At a 2-week run the effective day rate dips
   to ~€500 — acceptable *only* because the scan is also customer acquisition
   and scope is capped (a handful of sources / 3–5 processes). Landscapes beyond
   that cap are quoted, not absorbed.
3. **"From" prices for the two build packages** (already modelled in
   `priceKind: "from"`): the floor buys the smallest honest version; source
   count and complexity move it up. State the floor's scope on the detail page.
4. **Round Dutch-style** (€4.950, not €5.000): signals a calculated price rather
   than a guess, and stays under psychological thresholds.
5. **Review yearly.** Rates in this market moved ~5–8% year over year; the
   packages should follow.

## Sources

- [Freelapp — Freelance Data Engineer uurtarief 2026](https://freelapp.nl/uurtarief/data-engineer)
- [Knab — Uurtarief data-analist zzp 2026](https://bieb.knab.nl/ondernemen/wat-verdient-een-data-analist-zzp-bekijk-uurtarief-en-winst)
- [Ubuntu Staffing — ZZP ICT-tarieven 2026](https://ubuntustaffing.nl/blog/wat-is-het-gemiddelde-uurtarief-voor-een-zzper-in-de-it/)
- [Consultant.nl — Power BI consultant tarieven 2026](https://www.consultant.nl/salarissen/power-bi-consultant-salaris-tarief-loon)
- [KWEEKERS — Wat kost een Power BI consultant](https://www.kweekers.nl/inspiratie/blogs/wat-kost-een-power-bi-consultant/)
- [PulseBI — Wat kost een Power BI dashboard (MKB)](https://pulsebi.nl/blog-power-bi-kosten.html)
- [do-IT — Wat kost een dashboard](https://doitdigital.nl/kennisbank/wat-kost-een-dashboard)
- [FRISCON — Kosten Power BI dashboard](https://www.friscon.nl/blog/kosten-power-bi-dashboard-laten-bouwen)
- [Embed AI — AI Act compliance vaste prijzen](https://embedai.nl/en/diensten/ai-act-compliance-kosten)
- [SFAI Labs — AI Proof of Concept pricing](https://sfailabs.com/guides/ai-proof-of-concept-pricing)
- [Kellton — Custom AI chatbot / RAG cost guide 2026](https://www.kellton.com/kellton-tech-blog/custom-ai-chatbot-development-llm-rag)
- [JADS MKB Datalab — Data Maturity QuickScan](https://smartindustry.nl/diensten/assessments/data-maturity-quickscan-van-het-jads-mkb-datalab)
- [Data Crossroads — DM Maturity Scan](https://datacrossroads.nl/dm-maturity-scan/)
