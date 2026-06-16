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

All configuration lives in a single root `.env`:

```bash
cp .env.example .env                        # fill in your values
```

No `npm install` needed on the host — dependencies are installed in the images.

## Run the dev stack (hot reload)

Dev runs as an auto-merged Compose **override**: the committed
`docker-compose.yml` (production) plus a local, gitignored
`docker-compose.override.yml` that adds a self-contained Postgres and flips the
server/client to their hot-reload `dev` build targets. No infra repo required.
Source is bind-mounted; `node_modules` stays in the container.

The override is gitignored (local-only, never used on the VPS). Create it once
in the repo root:

```yaml
# docker-compose.override.yml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-devpassword}
      POSTGRES_DB: ${POSTGRES_DB:-ruudjuffermans}
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - ruudjuffermans_dev_db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-ruudjuffermans}"]
      interval: 5s
      timeout: 5s
      retries: 10
    networks: [backend]

  server:
    build:
      target: dev
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - CORS_ORIGIN=http://localhost:3000
      - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-devpassword}@db:5432/${POSTGRES_DB:-ruudjuffermans}?schema=public
      - CHOKIDAR_USEPOLLING=true
    command: sh -c "npx prisma generate && npx prisma migrate deploy && npm run dev"
    volumes:
      - ./server:/app
      - /app/node_modules

  client:
    build:
      target: dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:4000
      - NEXT_PUBLIC_SITE_URL=http://localhost:3000
      - WATCHPACK_POLLING=true
    volumes:
      - ./client:/app
      - /app/node_modules
      - /app/.next

volumes:
  ruudjuffermans_dev_db:

networks:
  backend:
    external: false
  frontend:
    external: false
```

Then bring the stack up — Compose merges both files automatically:

```bash
docker compose up --build   # start
docker compose down         # stop
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
docker compose exec db psql -U postgres -d ruudjuffermans

# Create a new migration after editing server/prisma/schema.prisma
docker compose exec server npx prisma migrate dev --name <change>

# Inspect data in a browser
docker compose exec server npx prisma studio
```

In production (`docker-compose.yml`) the DB is provided by the
`ruudjuffermans-infra` stack; the server applies `prisma migrate deploy` on boot.

## Run the production stack

Uses `docker-compose.yml` alone. It expects the external `frontend` / `backend`
networks from the infra stack — bring that up first.

On the VPS there is no `docker-compose.override.yml` (it's gitignored), so a plain
`docker compose up` is the production stack. **Locally**, where the dev override
exists, that same command would auto-merge it — so pass the base file explicitly
to run prod without the override:

```bash
docker compose -f docker-compose.yml up --build
```

## Working on a single service (optional, on host)

Each workspace can still be run directly without Docker. Export the root `.env`
first so both services pick up the shared config:

```bash
set -a && . .env && set +a                 # export root .env into the shell
cd server && npm install && npm run dev     # API on :4000
cd client && npm install && npm run dev     # frontend on :3000
```

This creates a local `node_modules/` inside that workspace only.
