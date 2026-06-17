#!/usr/bin/env bash
#
# Bootstrap the local development files (both gitignored, never committed):
#
#   .env                        - from .env.example (its defaults are dev-ready)
#   docker-compose.override.yml - self-contained dev stack (bundled Postgres +
#                                 hot-reload dev targets) auto-merged onto
#                                 docker-compose.yml
#
# Existing files are left untouched; pass --force (-f) to overwrite them.
#
#   ./setup-dev.sh
#   ./setup-dev.sh --force
#
set -euo pipefail

# Run relative to the repo root (this script's directory).
cd "$(dirname "$0")"

FORCE=0
case "${1:-}" in
  -f|--force) FORCE=1 ;;
  "") ;;
  *) echo "usage: $0 [--force]" >&2; exit 2 ;;
esac

# Returns 0 if we should (re)write $1, 1 if it exists and --force was not given.
should_write() {
  if [[ -e "$1" && "$FORCE" -ne 1 ]]; then
    echo "exists, skipping: $1  (use --force to overwrite)"
    return 1
  fi
  return 0
}

# --- .env ----------------------------------------------------------------
if should_write ".env"; then
  if [[ ! -f .env.example ]]; then
    echo "error: .env.example not found" >&2
    exit 1
  fi
  cp .env.example .env
  echo "created: .env"
fi

# --- docker-compose.override.yml -----------------------------------------
if should_write "docker-compose.override.yml"; then
  cat > docker-compose.override.yml <<'OVERRIDE_EOF'
# Local development only (gitignored, not used on the VPS). Auto-merged by
# Compose on top of the production docker-compose.yml:
#
#   docker compose up --build
#
# It flips the server/client to their `dev` build targets (hot reload via
# bind-mounted source), adds a self-contained Postgres so no infra repo is
# required, makes the backend/dokploy-network networks local instead of external,
# and publishes the dev ports:
#
#   Client:  http://localhost:3000
#   API:     http://localhost:4000   (health at /api/v1/health)
#   DB:      localhost:5432          (postgres / devpassword, db ruudjuffermans)
#
# Overridable defaults use ${VAR:-default}; set them in a `.env` next to this
# file to customise without editing it.
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
      # tsx watch -> chokidar; polling makes file events cross the bind mount on macOS/Windows
      - CHOKIDAR_USEPOLLING=true
    # Sync the Prisma client and apply migrations before the watcher starts.
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
      # Next.js/webpack file watching over the bind mount on macOS/Windows
      - WATCHPACK_POLLING=true
    volumes:
      - ./client:/app
      - /app/node_modules
      - /app/.next

volumes:
  ruudjuffermans_dev_db:

networks:
  # Local dev creates its own networks instead of joining the shared/Dokploy
  # ones (overrides external: true from docker-compose.yml).
  backend:
    external: false
  dokploy-network:
    external: false
OVERRIDE_EOF
  echo "created: docker-compose.override.yml"
fi

echo
echo "Done. Start the dev stack with:"
echo "  docker compose up --build"
echo "    client -> http://localhost:3000"
echo "    api    -> http://localhost:4000   (health at /api/v1/health)"
