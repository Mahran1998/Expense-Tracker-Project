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

### Run the full stack
```bash
# 1) (optional) create local env file
cp .env.example .env

# 2) start everything
make up

# 3) verify services quickly (smoke test)
make smoke