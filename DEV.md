# Development

This project runs via Docker Compose. There is no root `package.json` /
workspace install — each service (`client`, `server`) is a standalone package
that installs its own dependencies **inside its container** (`npm ci` in the
Dockerfile). See [README.md](./README.md) for the full overview.

## Layout

- `client/` — Next.js frontend (port `3000`)
- `server/` — Express API (port `4000`)
- `shared/` — shared TypeScript types

## First-time setup

```bash
cp server/.env.example server/.env         # fill in your values
cp client/.env.local.example client/.env.local
```

No `npm install` needed on the host — dependencies are installed in the images.

## Run the dev stack (hot reload)

Uses `docker-compose.dev.yml`. Source is bind-mounted; `node_modules` stays in
the container.

```bash
docker compose -f docker-compose.dev.yml up --build   # start
docker compose -f docker-compose.dev.yml down         # stop
```

- Client: http://localhost:3000
- API: http://localhost:4000
- Health check: http://localhost:4000/api/v1/health
- Postgres: localhost:5432 (`postgres` / `devpassword`, db `ruudjuffermans`)

## Database

The API uses PostgreSQL via [Prisma](https://www.prisma.io/). The dev stack runs
a `db` service; on `up` the server runs `prisma generate` + `prisma migrate
deploy` automatically, so the schema is always current. Data persists in the
`ruudjuffermans_dev_db` volume.

What's persisted: contact-form submissions (`contact_submissions`), newsletter
subscribers (`newsletter_subscribers`), and blog/portfolio page views
(`page_views`).

```bash
# Open a psql shell against the dev db
docker compose -f docker-compose.dev.yml exec db psql -U postgres -d ruudjuffermans

# Create a new migration after editing server/prisma/schema.prisma
docker compose -f docker-compose.dev.yml exec server npx prisma migrate dev --name <change>

# Inspect data in a browser
docker compose -f docker-compose.dev.yml exec server npx prisma studio
```

In production (`docker-compose.yml`) the DB is provided by the
`ruudjuffermans-infra` stack; the server applies `prisma migrate deploy` on boot.

## Run the production stack

Uses `docker-compose.yml`. This expects the external `frontend` / `backend`
networks from the infra stack — bring that up first.

```bash
docker compose up --build
```

## Working on a single service (optional, on host)

Each workspace can still be run directly without Docker:

```bash
cd server && npm install && npm run dev    # API on :4000
cd client && npm install && npm run dev    # frontend on :3000
```

This creates a local `node_modules/` inside that workspace only.
