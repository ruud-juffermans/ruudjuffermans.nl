# Packages

The seven packaged outcomes, grouped by the stage the buyer is in. The grouping is
what keeps seven packages reading as one path instead of a menu of capabilities.

| Phase | Package | Duration | Core artifact |
|---|---|---|---|
| 1 · Know | [Data scan](data-scan.md) | 1–2 weeks | source inventory + quality findings + target architecture w/ requirements + KPI definitions + quick wins |
| 1 · Know | [Process scan](process-scan.md) | 1–2 weeks | as-is process model + automation/AI opportunity map + requirements |
| 2 · Build | [A dashboard people actually open](dashboards.md) | 2–3 weeks | dashboards on the existing source + adoption |
| 2 · Build | [Your data warehouse](data-warehouse.md) | 3–4 weeks | modelled, tested data warehouse |
| 2 · Build | [AI prototype in 3 weeks](ai-prototype.md) | 3 weeks | working prototype + measured go/no-go |
| 3 · Run | [Reporting on autopilot](reporting-automation.md) | 1–2 weeks | automated, monitored report pipeline |
| 3 · Run | [AI literacy for your team](ai-workshop.md) | 1 day | trained team + ground rules + use-case list |

## How the phases connect

- **Phase 1 produces documents; phase 2 builds from them.** The scans' models,
  KPI definitions, and requirements are the discovery that phase 2 then doesn't
  repeat — which is why entering phase 2 with them is faster and cheaper than
  standalone.
- **AI is positioned as a consequence of the data work, not a separate offering.**
  The process scan answers "where does AI realistically fit"; the warehouse carries
  the bridge line ("built so AI can go on top later"); the prototype proves one case
  honestly.
- **Phase 3 keeps it alive without me:** automation with monitoring, and a team
  that can carry on.

Site copy for every package lives in `client/messages/{en,nl}.json` under the
`packages` namespace; ordering, accents, and prices in
`client/src/lib/packages.ts`. These documents are the source of truth for what each
package *is*; the site copy is its marketing rendering.
