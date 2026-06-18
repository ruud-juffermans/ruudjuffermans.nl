# ruudjuf-website

Personal / freelance (ZZP) website built as a TypeScript monorepo: a Next.js
frontend, an Express API, and a shared types package. It includes a bilingual
(Dutch / English) site with blog and portfolio sections backed by MDX content,
plus contact and newsletter forms wired to a hardened backend.

## Tech stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js 15 (App Router), React 19, Material UI 6, next-intl, MDX |
| Backend  | Express 5, Zod, Helmet, Nodemailer, Pino, express-rate-limit |
| Shared   | TypeScript types shared between client and server |
| Tooling  | TypeScript, Docker / Docker Compose |

## Project structure

```
.
├── client/          # Next.js frontend
│   ├── content/     # MDX blog & portfolio content (nl / en)
│   ├── messages/    # i18n translation files
│   └── src/
├── server/          # Express API (contact + newsletter)
│   └── src/
│       ├── middleware/   # validation, rate limiting, error handling
│       ├── routes/       # /contact, /newsletter
│       └── services/     # email (SMTP / Nodemailer), newsletter
├── shared/          # Shared TypeScript types
├── setup-dev.sh     # Generates the local .env + docker-compose.override.yml
├── .env.example     # Root env template
└── docker-compose.yml       # Production stack (joins the infra networks)
```

## Getting started

The project runs via Docker Compose — each service installs its own
dependencies inside its container, so no host-side `npm install` is required.

### Prerequisites

- Docker + Docker Compose

### Set up the local-dev files

```bash
./setup-dev.sh
```

This writes the two gitignored local-dev files: `.env` (from `.env.example`) and
`docker-compose.override.yml` — a self-contained dev stack with its own Postgres
and hot-reload `dev` build targets that Compose auto-merges onto
`docker-compose.yml`. No infra repo required. Re-run with `--force` to regenerate
them.

All configuration lives in the single root `.env`; Docker Compose auto-loads it.
When running a service directly on the host, export it first:
`set -a && . .env && set +a`.

| Variable               | Description                                   | Default |
| ---------------------- | --------------------------------------------- | ------- |
| `PORT`                 | API port                                      | `4000` |
| `NODE_ENV`             | `development` \| `production` \| `test`       | `development` |
| `CORS_ORIGIN`          | Allowed frontend origin                       | `http://localhost:3000` |
| `DATABASE_URL`         | Postgres connection string (host-run only)    | `…@localhost:5432/ruudjuffermans` |
| `SMTP_HOST`            | SMTP server host (empty = log to console)     | — |
| `SMTP_PORT`            | SMTP port (`587` STARTTLS, `465` TLS)         | `587` |
| `SMTP_SECURE`          | `true` for implicit TLS (port 465)            | `false` |
| `SMTP_USER`            | SMTP username                                 | — |
| `SMTP_PASS`            | SMTP password / token                         | — |
| `MAIL_FROM`            | From address for outgoing mail                | `Website <noreply@ruudjuf.nl>` |
| `CONTACT_EMAIL`        | Address that contact submissions are sent to  | — |
| `NEWSLETTER_API_KEY`   | Newsletter provider API key                   | `placeholder` |
| `POSTGRES_USER`        | Shared Postgres user (match infra in prod)    | `postgres` |
| `POSTGRES_PASSWORD`    | Shared Postgres password (match infra in prod)| `devpassword` |
| `NEXT_PUBLIC_API_URL`  | Base URL of the API (client)                  | `http://localhost:4000` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (client)                      | `http://localhost:3000` |

### Run in development

After `./setup-dev.sh`, Compose merges the override automatically:

```bash
docker compose up --build   # start
docker compose down         # stop
```

Starts the client (http://localhost:3000) and server (http://localhost:4000)
with hot reload, plus a bundled Postgres on `localhost:5432`
(`postgres` / `devpassword`, db `ruudjuffermans`).

### Database

The API uses PostgreSQL via [Prisma](https://www.prisma.io/). On `up`, the server
runs `prisma generate` + `prisma migrate deploy` automatically, so the schema is
always current; data persists in the `ruudjuffermans_dev_db` volume. Persisted:
contact-form submissions (`contact_submissions`), newsletter subscribers
(`newsletter_subscribers`), and page views (`page_views`).

```bash
# psql shell against the dev db
docker compose exec db psql -U postgres -d ruudjuffermans

# create a new migration after editing server/prisma/schema.prisma
docker compose exec server npx prisma migrate dev --name <change>

# inspect data in a browser
docker compose exec server npx prisma studio
```

### Run for production

`docker-compose.yml` alone expects the external `backend` network from the infra
stack (for the DB) and Dokploy's `dokploy-network` (for Traefik routing) — bring
the infra stack up first. The API exposes a health check at `GET /api/v1/health`;
the client waits for it before starting. In production the DB is provided by the
infra stack; the server applies `prisma migrate deploy` on boot. HTTPS and
public routing are handled by Dokploy's Traefik (domains set per service:
client `/`, server `/api`).

On the VPS there is no `docker-compose.override.yml` (it's gitignored), so a plain
`docker compose up` is the production stack. **Locally**, where the override
exists, that same command auto-merges it — so pass the base file explicitly to
run prod without the override:

```bash
docker compose -f docker-compose.yml up --build
```

### Working on a single service (on the host)

Each workspace can also run directly without Docker. Export the root `.env`
first so both services pick up the shared config:

```bash
set -a && . .env && set +a                 # export root .env into the shell
cd server && npm install && npm run dev     # API on :4000
cd client && npm install && npm run dev     # frontend on :3000
```

## API

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| `GET`  | `/api/v1/health`        | Health check           |
| `POST` | `/api/v1/contact`       | Submit the contact form |
| `POST` | `/api/v1/newsletter`    | Subscribe to newsletter |

Both `POST` endpoints validate input with Zod and are rate limited (5 requests
per IP per 15 minutes).

## License

[MIT](./LICENSE)
