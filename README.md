[![CI](https://github.com/Mahran1998/Expense-Tracker-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Mahran1998/Expense-Tracker-Project/actions/workflows/ci.yml)

# Expense Tracker (Full-Stack, Dockerized) — Small Business Ready Demo

A containerized expense tracking web app showing how a small business can run a full-stack product (UI + API + data + caching + messaging) with a reproducible local/CI workflow.

---

## Why this matters (business story)
Small businesses often manage expenses with Excel + receipts scattered across WhatsApp/email.
That creates:
- missing approvals and unclear accountability
- late monthly reporting and poor spend visibility
- messy reimbursements and “lost receipt” chaos

This project provides a **service-ready foundation** that can run on a small VM and grow into a production system.

---

## What it demonstrates (business + engineering)

### Business value (MVP scope)
- Capture expenses: amount, date, vendor, category, cost center, notes
- Approval workflow: `submitted → approved/rejected`
- Monthly summary totals + breakdowns (by category/status/currency)
- UI that feels like a real internal tool (dashboard + forms + approvals)

### Engineering / DevOps value (real proof)
- Multi-service architecture: frontend + backend + MongoDB + Redis + RabbitMQ
- Docker Compose orchestration (one command to run the whole stack)
- Healthchecks + dependency readiness (`depends_on: condition: service_healthy`)
- Nginx reverse proxy (single entrypoint: `:8080`)
- CI pipeline runs the stack + smoke tests (repeatable validation)

---

## Architecture
**Frontend:** React built and served by **Nginx**  
**Backend:** Node.js/Express API  
**MongoDB:** persistence for expense records  
**Redis:** caching foundation (future phase)  
**RabbitMQ:** async messaging foundation (future phase)

Flow:
- User opens: `http://localhost:8080`
- UI calls API via Nginx proxy: `/api/*`
- Backend persists to MongoDB

---

## Phases / Features

### Phase 3.2 — Business MVP API (DONE)
- `POST /api/expenses` — create an expense
- `GET /api/expenses` — list with filters (`from`, `to`, `category`, `status`)
- `PATCH /api/expenses/:id` — edit expense fields
- `PATCH /api/expenses/:id/status` — approve/reject
- `GET /api/reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD` — totals + breakdowns

### Phase 3.3 — Business MVP UI (DONE)
- Dashboard cards (totals/byStatus/top categories)
- Add expense form
- Filters (date range/category/status)
- Expense table with inline edit + approve/reject
- Single entrypoint experience on `:8080`

### Phase 4.1 — Real company workflow (Auth + Roles + Audit) (DONE)
Users + roles:
- `employee` — create + view **own** expenses; edit only **own submitted** expenses
- `manager` — view all; approve/reject submitted expenses; access reports
- `accountant` — access reports (and can view expenses; no edit/approve)

JWT authentication:
- Login returns a token
- Frontend attaches `Authorization: Bearer <token>` to API requests

Audit trail (stored in MongoDB):
- `createdBy`
- `updatedBy`
- `approvedBy`, `approvedAt` (set on approve/reject)

---

## Quick start (2 minutes)

### Prerequisites
- Docker + Docker Compose

### Run the stack (production-safe default: only 8080 exposed)
```bash
cp .env.example .env
make up
make smoke
