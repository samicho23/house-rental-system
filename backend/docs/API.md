# FaydaRent Backend — REST API Reference

Base URL (direct): `http://localhost:3001/api`
Via the frontend proxy: `/api` on the Next.js origin (recommended for browsers — same-origin cookies).

All requests and responses are JSON.

**Authentication** — login/register set an **httpOnly session cookie** (`hrs_session`, HS256 JWT). Send the cookie with every protected call.

**Error envelope** — `{ "error": "Human-readable message" }` with codes: `400` validation, `401` unauthenticated, `403` wrong role / not owner / suspended, `404` missing, `409` conflict, `500` server.

**Roles** — `TENANT`, `LANDLORD`, `ADMIN`. 🌐 = public.

---

## Health & Public

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | 🌐 | Liveness + database ping, uptime |
| GET | `/api` | 🌐 | Service info |
| GET | `/api/public/stats` | 🌐 | Landing counters: `{ properties, landlords, cities[] }` |

## Results

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/results` | 🌐 | Public property listings with non-sensitive application/contact counts |
| GET | `/api/admin/results` | ADMIN | Full combined property, application and contact-message overview |

## News

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/news` | 🌐 | List published news articles |
| GET | `/api/news/:slug` | 🌐 | Get one published news article |
| GET | `/api/admin/news` | ADMIN | List all news articles, including drafts |
| POST | `/api/admin/news` | ADMIN | Create a news article |
| PUT | `/api/admin/news/:id` | ADMIN | Update or publish a news article |
| DELETE | `/api/admin/news/:id` | ADMIN | Delete a news article |

## Contact

| Method | Path | Auth | Body / Notes |
|---|---|---|---|
| POST | `/api/contact` | 🌐 | `{ name, email, subject, message, phone? }` → 201; stores a new contact message |

## Auth

| Method | Path | Auth | Body / Notes |
|---|---|---|---|
| POST | `/api/auth/fayda` | 🌐 | `{ fin, consent: true }` → `{ claims, accountExists, existingRole }` |
| POST | `/api/auth/register` | 🌐 | `{ email, password, phone, firstName, lastName, role, faydaId, faydaVerified, city?, ... }` → 201 + session cookie |
| POST | `/api/auth/login` | 🌐 | `{ email, password }` → `{ user, token }` + cookie |
| POST | `/api/auth/logout` | 🌐 | clears the cookie |
| GET | `/api/auth/me` | ✓ | current profile |

## Fayda Identity

| Method | Path | Auth | Body / Notes |
|---|---|---|---|
| POST | `/api/fayda/verify` | 🌐 | `{ fin, consent: true }` → verified Fayda claims and account status |

## Authorization & Verification

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/authorizations/me` | ✓ | Return the current user's role and permissions |
| POST | `/api/verification/fayda` | 🌐 | Verify Fayda identity details |
| GET | `/api/verification/status` | ✓ | Return the current user's Fayda verification status |

## Properties

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/properties` | 🌐 | Query: `q, city, propertyType, minPrice, maxPrice, bedrooms, status, scope=mine&landlordId` — public results are `PUBLISHED+APPROVED` |
| GET | `/api/properties/:id` | 🌐 | Full detail incl. photos + landlord |
| POST | `/api/properties` | LANDLORD | Create (→ admin approval, admins notified) |
| PUT | `/api/properties/:id` | LANDLORD owner / ADMIN | Partial update; ADMIN may send `{ approvalStatus: "APPROVED" \| "REJECTED", rejectionReason }` |
| DELETE | `/api/properties/:id` | LANDLORD owner / ADMIN | Blocked while an active lease exists |

### Property Gallery

| Method | Path | Auth | Body / Notes |
|---|---|---|---|
| GET | `/api/properties/:propertyId/gallery` | 🌐 | List property photos |
| POST | `/api/properties/:propertyId/gallery` | LANDLORD owner / ADMIN | `{ url, isCover?, order? }` |
| PUT | `/api/properties/:propertyId/gallery/reorder` | LANDLORD owner / ADMIN | `{ photoIds: string[] }` |
| DELETE | `/api/properties/:propertyId/gallery/:photoId` | LANDLORD owner / ADMIN | Delete one photo |

## Applications

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/applications` | ✓ | Tenant: own · Landlord: for their properties · Admin: all |
| POST | `/api/applications` | TENANT | `{ propertyId, message?, moveInDate?, occupants, phone? }`; one pending application per property |
| PUT | `/api/applications/:id` | ✓ | `{ action: "WITHDRAW" }` (tenant) · `{ action: "APPROVE", startDate?, endDate?, deposit?, paymentDay?, decisionNote? }` (landlord → creates lease, property RENTED, others withdrawn) · `{ action: "REJECT", decisionNote? }` |

## Leases

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/leases` | ✓ | Role-aware; includes computed `balance` (paid, due, outstanding, overdue, next installment) |
| GET | `/api/leases/:id` | participant / ADMIN | Detail + ledger |
| PUT | `/api/leases/:id` | LANDLORD / ADMIN | `{ status: "ENDED" }` ends lease and republishes the property; also `monthlyRent`, `endDate`, `notes` |

## Payments (append-only ledger)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/payments` | ✓ | Query `?leaseId=`; role-scoped; returns `{ payments, totals { paid, pending, overdue } }` |
| POST | `/api/payments` | LANDLORD / ADMIN | `{ leaseId, amount, dueDate, method?, status?, periodLabel?, note? }` |
| PUT | `/api/payments/:id` | LANDLORD / ADMIN | `{ action: "MARK_PAID" \| "REOPEN", method?, note? }` |

## Maintenance

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/maintenance` | ✓ | Role-scoped |
| POST | `/api/maintenance` | TENANT | `{ propertyId, title, description, category?, priority? }` — requires an active lease on that property |
| PUT | `/api/maintenance/:id` | LANDLORD / ADMIN | `{ status: OPEN \| IN_PROGRESS \| RESOLVED \| CLOSED, response?, priority? }` |

## Notifications

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/notifications` | ✓ | `{ notifications, unreadCount }` |
| PUT | `/api/notifications/read` | ✓ | `{ id }` marks one; `{}` marks all read |

## Dashboard & Admin

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/dashboard` | ✓ | Per-role KPI block |
| GET | `/api/admin/reports` | ADMIN | Occupancy, rent collected per month, overdue, listings by type, approval queue, recent users |
| GET | `/api/admin/audit` | ADMIN | Audit log; query `?action=&entity=&actorId=&page=&pageSize=` |
| GET | `/api/admin/users` | ADMIN | Query `?q=&role=` |
| PUT | `/api/admin/users` | ADMIN | `{ id, action: "SUSPEND" \| "ACTIVATE" \| "SET_ROLE", role? }` — admins cannot modify their own account |

## Example

```bash
# login (store the cookie)
curl -c jar.txt -X POST localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"hirut@rental.et","password":"Landlord@123"}'

# role dashboard
curl -b jar.txt localhost:3001/api/dashboard

# approve a tenant application (creates the lease)
curl -b jar.txt -X PUT localhost:3001/api/applications/APP_ID \
  -H 'Content-Type: application/json' -d '{"action":"APPROVE"}'
```

A ready-made Postman collection is in `postman/faydarent.postman_collection.json`.

Audit events are persisted in the `AuditLog` table. Internal modules can record an
event through `auditService.record({ action, entity, entityId?, actorId?,
metadata?, ipAddress?, userAgent? })`; metadata is stored as JSON text.
