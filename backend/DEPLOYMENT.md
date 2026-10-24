# Deployment Guide

## Overview

The system consists of two processes:

| Process | Tech | Port | Notes |
|---|---|---|---|
| Frontend | Next.js 16 (root of the repository, code in `frontend/`) | 3000 | Proxies `/api/*` to the backend |
| Backend | Express 5 + Prisma (this folder) | 3001 | Standalone REST API, SQLite storage |

## 1. Backend (bare metal / VPS)

```bash
cd backend
cp .env.example .env
# edit .env: JWT_SECRET=$(openssl rand -hex 32), PORT, DATABASE_URL
bun install
bun run db:generate && bun run db:push && bun run db:seed   # first run only
bun run build           # optional: compile to dist/
bun run start           # bun src/server.ts
```

Run under a process manager:

```bash
# systemd unit (excerpt)
[Service]
WorkingDirectory=/srv/faydarent/backend
ExecStart=/usr/local/bin/bun src/server.ts
Restart=always
Environment=NODE_ENV=production
EnvironmentFile=/srv/faydarent/backend/.env
```

## 2. Backend (Docker)

```bash
cd backend
JWT_SECRET=$(openssl rand -hex 32) \
docker compose -f docker-compose.prod.yml up -d --build
curl http://localhost:3001/api/health
```

The SQLite file lives in the mounted `./db` volume — back it up regularly:

```bash
sqlite3 db/custom.db ".backup 'db/backup-$(date +%F).db'"
```

## 3. Frontend

From the repository root:

```bash
cp .env.example .env      # BACKEND_URL points at the API (default 127.0.0.1:3001)
bun install
bun run build && bun run start
```

`next.config.ts` forwards every `/api/*` request to `BACKEND_URL`, keeping the browser same-origin (cookies just work, no CORS). In production behind a reverse proxy (Nginx/Caddy), terminate TLS at the proxy and keep the two internal hops on the private network.

## 4. Environment variables

### backend/.env

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | API port |
| `NODE_ENV` | `development` | `production` enables strict error masking |
| `DATABASE_URL` | `file:../db/custom.db` | SQLite location (relative to `prisma/`) |
| `JWT_SECRET` | dev fallback | **Set a 32-byte random hex value in production** |
| `CORS_ORIGIN` | `*` | Comma-separated origins, `*` for any |

### Frontend (.env at repository root)

| Variable | Default | Description |
|---|---|---|
| `BACKEND_URL` | `http://127.0.0.1:3001` | Where the API proxy points |

## 5. Health & monitoring

- `GET /api/health` — liveness + database ping (used by the Docker healthcheck).
- Request logging is enabled in development; pipe stdout to your log collector in production.

## 6. Production checklist

- [ ] `JWT_SECRET` rotated to a strong random value
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGIN` restricted to the frontend origin(s)
- [ ] HTTPS terminated at the proxy (`secure` cookie flag can then be enabled in `src/lib/auth.ts`)
- [ ] Database backups scheduled
- [ ] Replace the simulated Fayda provider (`src/lib/fayda.ts`) with the production VeriFayda/eSignet OIDC client once partner approval is granted (proposal §9)
