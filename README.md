[![CI](https://github.com/Mahran1998/Expense-Tracker-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/Mahran1998/Expense-Tracker-Project/actions/workflows/ci.yml)

# Expense Tracker (Full-Stack, Dockerized) — Small Business Ready Demo

> A containerized expense tracking web app demonstrating how a small business can reliably run a full-stack product (UI + API + data + caching + messaging) with a reproducible local/CI workflow.

## Why this matters for a business
If you run a small company (shop, agency, freelancer team), expense tracking is a daily pain:
- scattered receipts, inconsistent categories, late monthly reporting
- unclear spending trends (where money leaks)
- hard to scale from “one laptop app” to a reliable shared system

This project shows a **practical foundation** for a lightweight internal expense tool you can deploy on a VM or cloud instance—then grow into a production service with CI/CD, monitoring, backups, and access control.

## What it demonstrates (business + engineering)
**Business value (demo scope):**
- Central place for recording and reviewing expenses (persisted in a database)
- API-first backend so it can integrate later with finance tooling, exports, dashboards
- Foundation for async workflows (e.g., notifications, approvals) using a message broker

**Engineering / DevOps value (real proof):**
- Multi-service architecture: frontend + backend + MongoDB + Redis + RabbitMQ
- Docker Compose orchestration (one command to run the whole stack)
- Nginx reverse proxy (`/api/*` → backend) like real deployments
- One-command validation via `make up` + `make smoke` (repeatable + recruiter-friendly)

## Architecture (simple)
- **Frontend:** React built and served by **Nginx**
- **Backend:** Node.js/Express API
- **MongoDB:** persistence for expense records
- **Redis:** caching layer (ready for performance improvements)
- **RabbitMQ:** messaging foundation (ready for async tasks like notifications/events)

Flow:
- User opens the app on `http://localhost:8080`
- UI calls the API through Nginx proxy at `/api/*`
- Backend uses MongoDB/Redis and can publish/consume events via RabbitMQ

## Quick start (2 minutes)
### Prerequisites
- Docker + Docker Compose (Docker Desktop or Linux Docker Engine)

## Business MVP: Expense Workflow (Phase 3.2)

This project implements a practical **small-business expense approval flow**:

**Employee** submits an expense → **Manager** approves/rejects → **Owner** views monthly totals and breakdowns.

### What it solves for a business owner
- Centralizes company spending (no scattered receipts/Excel files)
- Creates accountability via approval status (submitted/approved/rejected)
- Enables quick monthly reporting by currency/category/status
- Designed as a service-ready stack (API + DB + caching + messaging + reverse proxy)

### API Contract (Implemented)
- `POST /api/expenses` — create an expense
- `GET /api/expenses` — list expenses with filters (`from`, `to`, `category`, `status`)
- `PATCH /api/expenses/:id` — edit expense fields
- `PATCH /api/expenses/:id/status` — approve/reject
- `GET /api/reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD` — monthly summary totals + breakdowns

### Quick demo (copy/paste)
```bash
# create
curl -s -X POST http://localhost:8080/api/expenses \
  -H 'Content-Type: application/json' \
  -d '{"amount":19.9,"currency":"HUF","date":"2025-12-29","vendor":"Tesco","category":"Food","costCenter":"Office","notes":"Team lunch"}' | jq .

# list
curl -s "http://localhost:8080/api/expenses?from=2025-12-01&to=2025-12-31" | jq .

# approve
ID=<PASTE_ID_HERE>
curl -s -X PATCH "http://localhost:8080/api/expenses/$ID/status" \
  -H 'Content-Type: application/json' \
  -d '{"status":"approved"}' | jq .

# monthly summary
curl -s "http://localhost:8080/api/reports/summary?from=2025-12-01&to=2025-12-31" | jq .


### Run the full stack
```bash
# 1) (optional) create local env file
cp .env.example .env

# 2) start everything
make up

# 3) verify services quickly (smoke test)
make smoke
```bash

