# ruudjuf-website

Personal / freelance (ZZP) website built as a TypeScript monorepo: a Next.js
frontend, an Express API, and a shared types package. It includes a bilingual
(Dutch / English) site with blog and portfolio sections backed by MDX content,
plus contact and newsletter forms wired to a hardened backend.

## Tech stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | Next.js 15 (App Router), React 19, Material UI 6, next-intl, MDX |
| Backend  | Express 5, Zod, Helmet, Resend, Pino, express-rate-limit |
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
│       └── services/     # email (Resend), newsletter
├── shared/          # Shared TypeScript types
└── docker-compose.yml
```

## Getting started

The project runs via Docker Compose — each service installs its own
dependencies inside its container, so no host-side `npm install` is required.
See [DEV.md](./DEV.md) for the full development workflow.

### Prerequisites

- Docker + Docker Compose

### Configure environment

Copy the example env files and fill in your values:

```bash
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
```

Server variables (`server/.env`):

| Variable             | Description                                   | Default |
| -------------------- | --------------------------------------------- | ------- |
| `PORT`               | API port                                      | `4000` |
| `NODE_ENV`           | `development` \| `production` \| `test`       | `development` |
| `CORS_ORIGIN`        | Allowed frontend origin                       | `http://localhost:3000` |
| `RESEND_API_KEY`     | [Resend](https://resend.com) API key          | `re_placeholder` |
| `CONTACT_EMAIL`      | Address that contact submissions are sent to  | — |
| `NEWSLETTER_API_KEY` | Newsletter provider API key                   | `placeholder` |

Client variables (`client/.env.local`):

| Variable               | Description           | Default |
| ---------------------- | --------------------- | ------- |
| `NEXT_PUBLIC_API_URL`  | Base URL of the API   | `http://localhost:4000` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL       | `http://localhost:3000` |

### Run in development

```bash
docker compose -f docker-compose.dev.yml up --build
```

Starts the client (http://localhost:3000) and server (http://localhost:4000)
with hot reload. Stop with `docker compose -f docker-compose.dev.yml down`.

### Run for production

```bash
docker compose up --build
```

This expects the external `frontend` / `backend` networks from the infra stack
— bring that up first. The API exposes a health check at `GET /api/v1/health`;
the client waits for it before starting.

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
