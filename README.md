# ruudjuffermans-portfolio-analyst

The **data analyst / BI / data modeling** edition of the portfolio: a bilingual
(Dutch / English) Next.js site with project write-ups, an about/résumé page
and a contact form. It is a copy of `../ruudjuffermans-portfolio` (the
data & AI engineering edition), repositioned for analyst roles. The blog is a
separate site, [blog.ruudjuffermans.nl](https://blog.ruudjuffermans.nl).

## What differs from the engineering edition

- **Positioning.** All copy (`client/messages/{nl,en}.json`) is aimed at data
  analyst, BI and analytics roles: data modeling, Power BI, reporting, data
  quality. Structured data is a `Person` with jobTitle Data Analyst.
- **Main colour is orange** instead of blue: the tokens in
  `client/src/theme/theme.ts` (`#c2410c` light, `#fb923c` dark), plus the
  hard-coded accents in the CSS modules, the icon and the OG card.
- **Expertise pages** are `/expertise/data-modeling` and
  `/expertise/business-intelligence` (see `client/src/lib/expertise.ts`).
- **Two projects, not four.** The AI projects (digital twin, strafrecht-RAG)
  and the chat widget are gone. The open data warehouse and the public
  transport delays project are told from the analyst's side: the questions,
  the model, the metric definitions, the dashboards and the data quality.
- **Homepage:** "What I do" shows data modeling and BI & reporting with flow
  diagrams, the tools marquee lists analyst tooling, and the latest-articles
  section leaves out the blog's AI posts (`client/src/lib/blog.ts`).

## Tech stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js 15 (App Router), React 19, Material UI 6, next-intl, MDX |
| Backend  | [`ruudjuffermans-server`](https://github.com/ruud-juffermans/ruudjuffermans-server) — Express + Prisma, `website` module |
| Tooling  | TypeScript, Docker / Docker Compose |

## Project structure

```
.
├── client/          # Next.js frontend (the deployed artifact)
│   ├── content/     # MDX project content (nl / en)
│   ├── messages/    # i18n translation files
│   └── src/
├── .env.example     # Client env template
└── docker-compose.yml   # Production stack: client-only Next.js image
```

## Local development

Run the backend (the admin panel) first, then the site:

```bash
# 1. API — in ../admin-panel (see its README); run its server on :3100 so it
#    does not collide with Next on :3000:
docker compose -f docker-compose.dev.yml up -d
cd server && PORT=3100 npm run dev

# 2. This site:
cd client
npm install
npm run dev                                                     # :3000
```

With `NEXT_PUBLIC_API_URL` unset (the dev default), the browser calls
same-origin `/api/*` and `next.config.ts` rewrites it to the local panel
server on `:3100`. Contact emails print to the panel server's console when it
has no `SMTP_HOST` configured.

Configuration (see [`.env.example`](.env.example)):

| Variable               | Description                                              | Dev default |
| ---------------------- | -------------------------------------------------------- | ----------- |
| `NEXT_PUBLIC_API_URL`  | Backend (admin panel) origin; empty = same-origin + dev rewrite | *(empty)* |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (metadata, www→apex redirect)            | `http://localhost:3000` |

## Content

- **Projects** live in `client/content/projects/{nl,en}/*.mdx`. Frontmatter
  carries `title`, `industry`, `summary`, `tags`, optional `duration`, `repo`,
  `stats` and an `accent` hex colour for the project's band on `/projects`.
- **Blog posts** are not in this repo: the blog is its own site,
  [blog.ruudjuffermans.nl](https://blog.ruudjuffermans.nl) (the `blog-site`
  repo). This site links to it from the header and footer, shows the three
  latest data posts on the homepage from the blog's Atom feed (refreshed hourly,
  hidden when the blog is unreachable; see `client/src/lib/blog.ts`), and
  permanently redirects the old `/blog`, `/blog/<slug>`, `/blog/<slug>.md`
  and `/feed.xml` URLs there (`client/next.config.ts`).
- **Experience and skills** are translation data: `about.experience`,
  `home.experience.items` and `home.principles` in `client/messages/*.json`,
  plus the `skills` map at the top of `client/src/app/[locale]/about/page.tsx`.

## Deployment

`docker-compose.yml` builds the standalone Next.js image (build args bake
`NEXT_PUBLIC_API_URL` and the site URL in) on the external `dokploy-network`;
Traefik routes the domain to it. Set `NEXT_PUBLIC_SITE_URL` to whatever domain
this copy ends up on — the `www` redirect in `next.config.ts` still targets
`ruudjuffermans.nl` and needs updating if the portfolio moves elsewhere.

## License

[MIT](./LICENSE)
