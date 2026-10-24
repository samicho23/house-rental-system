# FaydaRent — Backend Service

REST API for the **House & Apartment Rental System**. Built with **Express 5 + TypeScript + Prisma (SQLite)** in a modular architecture: every domain lives in its own module folder with `routes → controller → service → repository` layers, Zod validation and a central error envelope.

## Features

- **Auth & identity** — Fayda (VeriFayda/eSignet) digital-ID verification flow, scrypt password hashing, HS256 JWT sessions in httpOnly cookies, role guards, ownership checks.
- **Fayda module** — dedicated public verification endpoint at `POST /api/fayda/verify`.
- **Authorization & verification** — role permissions at `/api/authorizations/me` and verification status at `/api/verification/status`.
- **Properties** — public search with filters, landlord CRUD, admin moderation (approve/reject with reason).
- **Applications** — tenant apply/withdraw, landlord approve (auto-creates lease, marks property RENTED, withdraws competing applications) or reject.
- **Leases & payments** — role-aware lease lists with computed balances, append-only rent ledger with due/overdue tracking.
- **Maintenance** — tenant reports, landlord status workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED).
- **Notifications** — in-app notification feed with unread counters.
- **Dashboards & reports** — per-role KPI blocks; admin analytics (occupancy, monthly rent, listings by type).
- **Ops** — `/api/health` probe, request logging, Docker + docker-compose, Postman collection, bun test suite.
- **API documentation** — interactive Swagger UI at `/api-docs` and OpenAPI JSON at `/api-docs.json`.
- **Contact** — public contact form submission at `POST /api/contact`.
- **Results** — public overview at `GET /api/results`; full records for admins at `GET /api/admin/results`.
- **News** — public published articles at `GET /api/news`; admin CRUD at `/api/admin/news`.
- **Property galleries** — public photo lists with owner/admin add, delete, and reorder operations.

## Project structure

```
backend/
├── src/
│   ├── server.ts              # entry point (listens on :3001)
│   ├── app.ts                 # Express app: middleware stack + routes
│   ├── config/env.ts          # typed environment configuration
│   ├── constants/             # domain enums (roles, statuses, categories)
│   ├── errors/AppError.ts     # application error type + helpers
│   ├── lib/                   # framework-free services
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # scrypt hashing, JWT sign/verify
│   │   ├── fayda.ts           # VeriFayda/eSignet simulation (OIDC interface)
│   │   └── notifications.ts   # notification helpers, overdue refresh
│   ├── middleware/            # authenticate, authorize, validate, error, 404
│   ├── modules/               # one folder per domain
│   │   ├── auth/              # fayda, register, login, logout, me
│   │   ├── properties/        # search + CRUD + moderation
│   │   ├── applications/      # apply / withdraw / approve(->lease) / reject
│   │   ├── leases/            # lists, balances, end lease
│   │   ├── payments/          # append-only rent ledger
│   │   ├── maintenance/       # report + status workflow
│   │   ├── notifications/     # feed + mark read
│   │   ├── dashboard/         # per-role KPIs
│   │   ├── users/             # admin user management
│   │   ├── reports/           # admin analytics
│   │   ├── meta/              # public landing stats
│   │   └── health/            # liveness probe
│   ├── routes/index.ts        # mounts all modules under /api
│   ├── types/                 # express Request augmentation, session types
│   └── utils/                 # asyncHandler, parseId, assertOwnership
├── prisma/schema.prisma       # Prisma data model
├── db/custom.db               # SQLite database file (gitignored in real deploys)
├── scripts/                   # seed.ts, gen-images.ts
├── postman/                   # ready-to-import API collection
├── tests/                     # bun test suites
├── docs/API.md                # full REST reference
├── Dockerfile
├── docker-compose.yml         # dev
└── docker-compose.prod.yml    # production
```

Every module follows the same layering:

| File | Responsibility |
|---|---|
| `*.routes.ts` | URL paths, middleware chain (authenticate → authorize → validate) |
| `*.controller.ts` | HTTP layer: request → service, status codes, cookies |
| `*.service.ts` | Business rules, notifications, cross-entity workflows |
| `*.repository.ts` | Prisma queries only |
| `*.validations.ts` | Zod schemas + inferred types |

## Quick start

```bash
cd backend
cp .env.example .env        # adjust DATABASE_URL / JWT_SECRET if needed
npm install                 # or bun install
npm run db:generate         # generate the Prisma client
npm run dev:node            # http://localhost:3001
```

Open `http://localhost:3001/api-docs` to browse and try the API with Swagger UI.
The validation/import document is available at
`http://localhost:3001/swagger-check.json` and is also stored at
`backend/swagger-check.json`.

The frontend (Next.js, repository root / `frontend/`) proxies `/api/*` to this service via `next.config.ts` rewrites, so no CORS setup is needed for the browser. For direct API access (Postman, other clients) the service runs standalone on port 3001.

### Node.js setup

The backend runs on Node.js 20+ with Express, TypeScript, and Prisma:

```bash
cd backend
copy .env.example .env       # Windows
npm install
npm run db:generate
npm run db:push
npm run dev:node
```

The API is available at `http://localhost:3001`, with Swagger UI at
`http://localhost:3001/api-docs`.

Useful commands:

| Command | Description |
|---|---|
| `bun run dev` | Hot-reload dev server (bun --hot) |
| `bun run dev:node` | Dev server with tsx watch (Node) |
| `bun run start` | Production start (bun) |
| `bun run build` | Compile TypeScript to `dist/` |
| `bun run typecheck` | tsc --noEmit |
| `bun test` | Run the test suite |
| `bun run db:push` | Sync schema to SQLite |
| `bun run db:seed` | Seed demo data |
| `npm run validate` | Validate the Prisma schema |
| `npm run format` | Format the Prisma schema |
| `npm run studio` | Open Prisma Studio |

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@rental.et` | `Admin@123` |
| Landlord | `hirut@rental.et` | `Landlord@123` |
| Tenant | `samuel@rental.et` | `Tenant@123` |

## Security model

1. Passwords: scrypt with per-user random salt (stored `salt:hash`).
2. Sessions: HS256 JWT (`sub, role, name, exp`) inside an **httpOnly SameSite=Lax cookie**; the token never touches client JS.
3. Authorization: `authenticate` middleware verifies the session and loads the account (suspended accounts are rejected immediately); `requireRole(...)` guards role-restricted routes; `assertOwnership` enforces object-level ownership.
4. Validation: every write endpoint passes through a Zod schema before reaching services.
5. Financial integrity: payments form an append-only ledger (no delete, no amount edits).

## Docker

```bash
docker compose up --build          # dev
JWT_SECRET=$(openssl rand -hex 32) \
  docker compose -f docker-compose.prod.yml up -d --build
```
