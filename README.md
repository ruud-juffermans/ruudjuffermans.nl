# ruudjuffermans.nl

Personal / freelance (ZZP) website: a bilingual (Dutch / English) Next.js site
with blog and portfolio sections backed by MDX content, plus contact and
newsletter forms. Runs at `ruudjuffermans.nl`.

**Client-only since the platform consolidation.** The site's backend (contact
form, newsletter signups, page-view analytics and their admin API) moved into
[`../ruudjuffermans-server`](../ruudjuffermans-server) — the shared platform
API at `api.ruudjuffermans.nl` — as its `website` module. See
`../PLATFORM_ARCHITECTURE_PLAN.md` for the architecture. Unlike the maxxing
apps this site has no user accounts; its API calls are anonymous and
rate-limited server-side.

## Tech stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js 15 (App Router), React 19, Material UI 6, next-intl, MDX |
| Backend  | [`ruudjuffermans-server`](../ruudjuffermans-server) — Express + Prisma, `website` module |
| Shared   | TypeScript types shared between client and (legacy) server |
| Tooling  | TypeScript, Docker / Docker Compose |

## Project structure

```
.
├── client/          # Next.js frontend (the deployed artifact)
│   ├── content/     # MDX blog & portfolio content (nl / en)
│   ├── messages/    # i18n translation files
│   └── src/
├── server/          # LEGACY pre-consolidation Express API — not deployed
├── shared/          # Shared TypeScript types
├── setup-dev.sh     # LEGACY (targeted the old full-stack dev setup)
├── .env.example     # Client env template
└── docker-compose.yml   # Production stack: client-only Next.js image
```

## Local development

Run the platform API first, then the site:

```bash
# 1. API — in ../ruudjuffermans-server (see its README):
docker compose -f docker-compose.dev.yml up -d && npm run dev   # :4000

# 2. This site:
cd client
npm install
npm run dev                                                     # :3000
```

With `NEXT_PUBLIC_API_URL` unset (the dev default), the browser calls
same-origin `/api/*` and `next.config.ts` rewrites it to the local platform
server on `:4000` — no CORS involved in dev. Contact/verification emails print
to the platform server's console when it has no `SMTP_HOST` configured.

> Dev-port note: Next's default port (3000) is also the fitnessmaxxing client's
> dev port — run one of the two at a time locally.

Configuration (see [`.env.example`](.env.example)):

| Variable               | Description                                              | Dev default |
| ---------------------- | -------------------------------------------------------- | ----------- |
| `NEXT_PUBLIC_API_URL`  | Platform API origin; empty = same-origin + dev rewrite   | *(empty)* |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (metadata, www→apex redirect)            | `http://localhost:3000` |

`CONTACT_EMAIL`, `NEWSLETTER_API_KEY`, `SMTP_*` and `ADMIN_SERVICE_TOKEN` now
live in `../ruudjuffermans-server/.env.example`.

## Deployment

`docker-compose.yml` builds the standalone Next.js image (build args bake
`NEXT_PUBLIC_API_URL=https://api.ruudjuffermans.nl` and the site URL in) on the
external `dokploy-network`; Traefik routes `ruudjuffermans.nl` (and `www.`,
which the app 308-redirects to the apex) to it. No server or database here —
those belong to the `ruudjuffermans-server` stack, whose CORS allowlists this
site's origin.

## API (served by ruudjuffermans-server)

| Method | Endpoint                             | Description             |
| ------ | ------------------------------------ | ----------------------- |
| `GET`  | `/api/health`                        | Platform health check   |
| `POST` | `/api/website/contact`               | Submit the contact form |
| `POST` | `/api/website/newsletter`            | Subscribe to newsletter |
| `POST` | `/api/website/analytics`             | Page-view beacon        |
| `GET`  | `/api/website/analytics/views?path=` | View count for a path   |
| *      | `/api/website/admin/…`               | Contact/newsletter/analytics management (service token or platform admin) |

The `POST` form endpoints validate input with Zod and are rate limited (5 per
IP per 15 minutes; the analytics beacon 60 per minute).

## License

[MIT](./LICENSE)
