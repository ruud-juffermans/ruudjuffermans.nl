# Implementatieplan — repositionering ruudjuffermans.nl

> **Status: uitgevoerd.** Fase 1 t/m 6 staan in de working tree (nog niet
> gecommit), en het aanbod is daarna uitgebreid van vijf naar **zeven pakketten
> in drie fases** — zie "Pakketten" hieronder.
>
> Eén ding ontbreekt: de **zeven prijzen**. Tot die er zijn staat `price: null`
> in `client/src/lib/packages.ts` en toont de site "Prijs op aanvraag" — geen
> placeholder die per ongeluk live kan gaan. Invullen is zeven regels in dat ene
> bestand; de opmaak per taal gaat vanzelf.

Uitvoering van de review in `plan.md`. Vastgelegde keuzes:

- **Prijzen**: echte, vaste bedragen op de pagina (nummers volgen van Ruud).
- **Portfolio**: wordt **Projecten / Projects**; de twee items worden eerlijk
  gelabeld als eigen demo-projecten.
- **/diensten**: de drie disciplinepagina's worden **vervangen** door packages,
  met redirects van de oude URL's.
- **Zeven packages** in drie fases, inclusief de workshop.

---

## Kern van de herpositionering

Eén verhaal in plaats van drie disciplines:

> De meeste AI-projecten stranden op de data, niet op het model. Ik bouw de laag
> eronder — daarna werkt de AI erop wél.

Gevolg voor de site: **analytics engineering is wat je verkoopt, AI is wat het
mogelijk maakt.** De Datascan is de voordeur; alles funnelt daarheen.

---

## Fase 1 — Twee dingen die vandaag fout staan

Klein, losstaand, direct te mergen.

### 1.1 Beschikbaarheidsbadge

`src/components/Availability.tsx` berekent de huidige maand, dus vandaag staat er
letterlijk "Beschikbaar vanaf augustus 2026" — dat leest als verouderd of als
"nog niet beschikbaar". De maand verdwijnt.

| Bestand | Wijziging |
|---|---|
| `src/components/Availability.tsx` | `Intl.DateTimeFormat`-berekening en de `month`-prop eruit; ook de lege `<span suppressHydrationWarning>` opruimen (staat er nu dubbel, regel 20–21) |
| `messages/nl.json` → `common` | `availableHero`: "Nu beschikbaar voor nieuwe opdrachten" · `availableFrom`: "Beschikbaar voor nieuwe opdrachten" |
| `messages/en.json` → `common` | idem, Engels |

### 1.2 Portfolio → Projecten, en eerlijke labels

| Bestand | Wijziging |
|---|---|
| `src/i18n/routing.ts` | `/portfolio` → `{ nl: "/projecten", en: "/projects" }`; idem `/portfolio/[slug]` |
| `next.config.ts` → `redirects()` | 301 van `/portfolio` en `/portfolio/:slug` naar de nieuwe paden |
| `messages/{nl,en}.json` | `nav.portfolio` → "Projecten" / "Projects"; `footer.moreLinks.portfolio` idem; `portfolio.*` teksten herschrijven (zie hieronder) |
| `content/portfolio/` | hernoemen naar `content/projects/`; `src/lib/content.ts` `kind`-union en functienamen mee (`getProjectItems`) |
| beide `.mdx`-bestanden ×2 locales | frontmatter `industry: "Showcase project"` → `industry: "Eigen project"` / `"Own project"` |
| beide `.mdx`-bestanden | bovenaan één regel: dit is een eigen project, gebouwd om de aanpak te laten zien — geen betaalde klantopdracht |

Nieuwe subtitel op de projectenpagina, in plaats van "case studies":

> Eigen projecten waarin ik de complete keten bouw — van ruwe bron tot werkend
> dashboard of AI-toepassing. Geen klantnamen, wel de volledige aanpak.

De route-key in de code blijft `/portfolio` → nee: hernoem de pathname-key naar
`/projects` zodat `Link href="/projects"` leest zoals het is. Raakt
`Header.tsx`, `Footer.tsx`, `src/app/[locale]/page.tsx` (CTA + `projects.all`),
en de twee pagina's onder `src/app/[locale]/portfolio/` (map hernoemen naar
`projects/`).

---

## Fase 2 — De packages als datamodel

Voordat er UI komt: één bron van waarheid voor de packages, want ze verschijnen
op drie plekken (home-teaser, /diensten, detailpagina).

**Nieuw bestand `src/lib/packages.ts`:**

```ts
export type PackagePhase = "know" | "build" | "run";

export const PACKAGES: PackageDef[] = [
  { slug: "data-scan",              phase: "know",  accent: palette.red, featured: true },
  { slug: "requirements-and-kpis",  phase: "know",  accent: "#14B8A6" },
  { slug: "dashboards",             phase: "build", accent: "#0EA5E9" },
  { slug: "single-source-of-truth", phase: "build", accent: "#3B82F6" },
  { slug: "ai-prototype",           phase: "build", accent: "#8B5CF6" },
  { slug: "reporting-automation",   phase: "run",   accent: "#10B981" },
  { slug: "ai-workshop",            phase: "run",   accent: "#F59E0B" },
];
```

Slugs blijven Engelstalig in beide locales, net als de huidige
`data-engineering`/`ai-genai` — next-intl lokaliseert het `[slug]`-segment niet.

**Zeven slots per package**, exact zoals de review voorschrijft. Elk package
krijgt in `messages/{nl,en}.json` onder een nieuwe namespace `packages`:

```
packages.<slug>.name          — de uitkomst, in hun woorden
packages.<slug>.recognise     — "Herken je dit?", één zin
packages.<slug>.promise       — wat je overhoudt
packages.<slug>.deliverables  — 3–5 concrete artefacten (array)
packages.<slug>.duration      — vaste doorlooptijd
packages.<slug>.price         — vast bedrag of "vanaf €X"
packages.<slug>.proofSlug     — link naar project of repo (optioneel)
```

De oude namespaces `services.items.*`, `services.categories.*` en
`serviceDetail.data-engineering|data-analytics|ai-genai` verdwijnen. Wat daaruit
bruikbaar is (deliverables, "voor wie") gaat op in de nieuwe pakketteksten.

### Pakketten — zeven, gegroepeerd in drie fases

De fase-indeling is wat zeven pakketten laat lezen als één pad in plaats van een
menu met capaciteiten. `phase` staat per pakket in `src/lib/packages.ts`.

**Fase 1 — Weten waar je staat**

| Slug | Naam (NL) | Doorlooptijd | Prijs |
|---|---|---|---|
| `data-scan` | Datascan *(uitgelicht — "Begin hier")* | 1 week | vast — **nummer nodig** |
| `requirements-and-kpis` | Scherpe vraag | 1–2 weken | vast — **nummer nodig** |

**Fase 2 — Bouwen wat er moet komen**

| Slug | Naam (NL) | Doorlooptijd | Prijs |
|---|---|---|---|
| `dashboards` | Dashboard dat wél gebruikt wordt | 2–3 weken | vanaf — **nummer nodig** |
| `single-source-of-truth` | Één versie van de waarheid | 3–4 weken | vanaf — **nummer nodig** |
| `ai-prototype` | AI-prototype in 3 weken | 3 weken | vast — **nummer nodig** |

**Fase 3 — Draaiend houden en meenemen**

| Slug | Naam (NL) | Doorlooptijd | Prijs |
|---|---|---|---|
| `reporting-automation` | Rapportage op de automatische piloot | 1–2 weken | vast — **nummer nodig** |
| `ai-workshop` | AI-geletterdheid voor je team | 1 dag | vast — **nummer nodig** |

`Scherpe vraag` bundelt KPI-definities en requirements: dezelfde koper, dezelfde
week, dezelfde oplevering. De meetbaarheidstoets ("zit het gevraagde überhaupt in
je data?") is wat het onderscheidt van een workshop van een adviesbureau, en
`"ook als je het door een ander laat bouwen"` maakt de spec leverancier-neutraal.

`Dashboard dat wél gebruikt wordt` bestaat naast het datawarehouse-pakket omdat
het een andere koper heeft: iemand met bruikbare data die géén warehouse-traject
wil. Adoptie zit in scope — daar sneuvelen dashboards op, niet op techniek. Het
warehouse-pakket belooft daarom niet langer "één dashboard", maar het
datawarehouse zelf.

Twee zinnen die letterlijk zo moeten blijven staan, want dáár zit de
positionering:

- `ai-prototype`: *"…en een go/no-go-advies — ook als dat 'niet doen' is."*
- `requirements-and-kpis`: *"ook als je het door een ander laat bouwen."*

En `single-source-of-truth` en `reporting-automation` dragen de brugzin:
*"Gebouwd zodat je er later AI op kunt zetten — geen herbouw nodig."*

---

## Fase 3 — /diensten herbouwen

`src/app/[locale]/services/page.tsx` wordt volledig herschreven. Nieuwe volgorde,
precies de paginastructuur uit de review:

1. **Eén positioneringsregel** (hero) — het fundament-verhaal, geen "van
   strategie tot implementatie" meer.
2. **Fase 1 — Weten waar je staat**: Datascan (accentrand + "Begin hier"-chip)
   en Scherpe vraag, elk op halve breedte.
3. **Fase 2 — Bouwen**: dashboards, datawarehouse en AI-prototype, elk op een
   derde.
4. **Fase 3 — Draaiend houden**: rapportage-automatisering en de workshop, elk
   op halve breedte.
5. **"Ook mogelijk"** — korte opsomming voor maatwerk, zodat off-shape leads niet
   weglopen. Hier landen de resten van de oude disciplineteksten: data
   engineering, ad-hoc analyse, custom modellen, interim-inzet.
6. **Proof** — de bewijsstrip plus links naar de projecten.
7. **FAQ** — tarief, werkwijze, remote/op locatie, contractvorm.
8. **Eén CTA**, herhaald boven en onder.

**Nieuwe componenten:**

| Component | Rol |
|---|---|
| `src/components/PackageCard.tsx` | de zeven slots als één kaart; `featured`-variant voor de Datascan |
| `src/components/ProofStrip.tsx` | "Data engineer bij NLR · Data & AI bij de Politie · Duizenden cursisten op Udemy" — herbruikt in de hero |
| `src/components/Faq.tsx` | MUI `Accordion`, vragen uit `messages.services.faq[]` |

**Detailpagina** `src/app/[locale]/services/[slug]/page.tsx`: de `SERVICES`-const
wordt vervangen door `PACKAGES`. Layout: alle zeven slots uitgebreid, plus een
"zo verloopt het"-tijdlijn per week en een link naar het bijbehorende project.

**Redirects** in `next.config.ts`, permanent:

```
/diensten/data-engineering  → /diensten
/diensten/data-analytics    → /diensten/single-source-of-truth
/diensten/ai-genai          → /diensten/ai-prototype
```
(en de `/services/...`-varianten)

**Navigatie**: `Header.tsx` heeft `SERVICE_SLUGS` en `menus.services.*`
hardgecodeerd — die dropdown krijgt de zeven packages in plaats van drie
disciplines, met de Datascan bovenaan. Zelfde lijst in de mobiele drawer.
`Footer.tsx` `servicesLinks` wijst nu drie keer naar `/services`; dat worden
directe links naar de vier belangrijkste packages.

---

## Fase 4 — Homepage

`src/app/[locale]/page.tsx`, van boven naar beneden.

### 4.1 Hero

Nieuwe copy, conform de review:

> **Je hebt data. En AI-plannen. Wat ertussen mist is het fundament.**
>
> Ik bouw datafundamenten waar je rapportage én je AI op draaien. Vaste scope,
> vaste prijs, in weken — niet in kwartalen.

Direct eronder `<ProofStrip />`. De `TechMarquee` schuift een plek naar beneden —
bewijs eerst, tools daarna. Secundaire CTA wijst naar `/diensten` in plaats van
`/projecten`, want de packages zijn nu de conversie.

Raakt: `home.hero.*` in beide message-bestanden.

### 4.2 Servicesband

De `ServicesShowcase`-band (donkere sectie met het flow-diagram) blijft staan —
het diagram is sterk — maar de kopij eromheen verschuift van "twee
specialisaties" naar het fundament-verhaal. De twee pills blijven *Data
Analytics* en *AI & GenAI*, maar de titel wordt de brug tussen beide:

> Eerst het fundament. Daarna werkt de AI erop wél.

De "meer over"-link wijst naar `/diensten`.

### 4.3 Nieuwe packagesectie

Nieuwe band ná de servicesband en vóór "Hoe ik werk": de Datascan uitgelicht plus
vier compacte kaarten, elk met naam, doorlooptijd en prijs, linkend naar de
detailpagina. Dit is wat de review bedoelt met "update de drie serviceblokken
zodat ze naar de packages wijzen".

### 4.4 Probleemkaarten

`home.problem.card1–3` zijn nu inwisselbaar ("Data waar je niets mee doet", "Geen
fundament", "AI-onzekerheid"). Herschrijven naar situaties die specifiek zijn
voor het fundament-verhaal, elk eindigend in het package dat het oplost.

### 4.5 whyFreelance

Zes kaarten waarvan er één letterlijk "Eén aanspreekpunt" heet — de zin die de
review als generiek aanwijst. Terugbrengen naar vier, met de resterende gericht
op wat alleen voor Ruud geldt: overheids-/politiecontext, AVG binnen
rijkskaders, kennisoverdracht als vak (Udemy), vaste prijs in plaats van uurtje-
factuurtje.

---

## Fase 5 — Over mij en bewijs

De twee sterkste troeven staan begraven in de tijdlijn.

- `about.intro1–3` herschrijven zodat politie en Udemy in de eerste alinea staan,
  niet in de derde.
- De tijdlijn blijft, maar de twee regels die ertoe doen krijgen een
  accentbehandeling.
- `ProofStrip` ook bovenaan `/over-mij`.
- Blog blijft de plek waar AI-diepgang bewezen wordt — geen wijziging nodig, de
  zes bestaande artikelen doen dat werk al.

---

## Fase 6 — Metadata en sluitwerk

- `site.description`, `home.metaTitle`, `services.metaTitle/metaDescription`:
  "Van strategie tot implementatie" eruit, fundament-verhaal erin.
- `footer.tagline` idem.
- `messages/en.json` volledig gelijktrekken met `nl.json` — elke sleutel die in
  fase 1–5 verandert, verandert in beide.
- `npm run build` moet schoon draaien; `tsc` vangt de hernoemde routes en
  ontbrekende message-keys.

---

## Volgorde en omvang

| Fase | Inhoud | Los te mergen? |
|---|---|---|
| 1 | Badge + Projecten-hernoeming | ja, direct |
| 2 | `packages.ts` + alle pakketteksten NL/EN | ja (nog niet zichtbaar) |
| 3 | /diensten herbouw + detailpagina's + redirects + nav | grootste blok |
| 4 | Homepage | na 3 |
| 5 | Over mij + ProofStrip | los |
| 6 | Metadata, EN-pariteit, build | afsluitend |

Fase 1 en 2 kunnen parallel; 3 en 4 zijn de bulk van het werk; 5 en 6 zijn klein.

---

## Wat ik nog nodig heb

**De zeven prijzen.** Alles staat klaar zodra deze er zijn — één regel per
pakket in `client/src/lib/packages.ts`:

| Pakket | Doorlooptijd | Soort |
|---|---|---|
| Datascan | 1 week | vast |
| Scherpe vraag | 1–2 weken | vast |
| Dashboard dat wél gebruikt wordt | 2–3 weken | vanaf |
| Één versie van de waarheid | 3–4 weken | vanaf |
| AI-prototype in 3 weken | 3 weken | vast |
| Rapportage op de automatische piloot | 1–2 weken | vast |
| AI-geletterdheid voor je team | 1 dag | vast |

Los daarvan, twee dingen die de copy scherper maken maar geen blokkade zijn:

- Het aantal Udemy-cursisten ("duizenden" mag, een getal is sterker).
- Of de politie-opdracht bij naam genoemd mag worden zoals nu, of dat er een
  afgesproken formulering voor is.
