# API Contract — Expense Tracker MVP

Base URL (local via frontend proxy):
- http://localhost:8080/api

Backend direct (optional):
- http://localhost:3000

## Conventions
- All responses are JSON (except /health which returns "OK")
- Dates are ISO format: YYYY-MM-DD
- id is a string (Mongo ObjectId style)

### Status enum
- pending
- approved
- rejected

### Error format (standard)
{
  "error": "validation_error",
  "message": "amount must be > 0",
  "details": { "field": "amount" }
}

---

## 1) Health
GET /health
- 200 OK
- Body: "OK"

---

## 2) Create expense
POST /expenses

Request body:
{
  "amount": 19.9,
  "currency": "HUF",
  "date": "2025-12-29",
  "vendor": "Tesco",
  "category": "Food",
  "costCenter": "Office",
  "notes": "Team lunch"
}

Response: 201 Created
{
  "id": "64f0...",
  "amount": 19.9,
  "currency": "HUF",
  "date": "2025-12-29",
  "vendor": "Tesco",
  "category": "Food",
  "costCenter": "Office",
  "notes": "Team lunch",
  "status": "pending",
  "createdAt": "2025-12-29T10:00:00.000Z",
  "updatedAt": "2025-12-29T10:00:00.000Z"
}

Validation rules:
- amount: required, number, > 0
- currency/date/vendor/category/costCenter: required
- notes: optional

---

## 3) List + filter expenses
GET /expenses?from=YYYY-MM-DD&to=YYYY-MM-DD&category=Food&status=pending

Query params (all optional):
- from: start date (inclusive)
- to: end date (inclusive)
- category
- status
- costCenter
- vendor
- limit (default 50)
- offset (default 0)

Response: 200 OK
{
  "items": [ { expense }, ... ],
  "total": 123,
  "limit": 50,
  "offset": 0
}

---

## 4) Edit expense (fields)
PATCH /expenses/:id

Request body (any subset):
{
  "vendor": "Tesco Express",
  "notes": "Updated note"
}

Rules:
- MVP: only editable if status = pending

Response: 200 OK (updated expense)

---

## 5) Approve / reject (status)
PATCH /expenses/:id/status

Request body:
{
  "status": "approved"
}

Rules:
- pending -> approved/rejected only
- approved/rejected final (MVP)

Response: 200 OK (updated expense)

---

## 6) Summary report
GET /reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD

Response: 200 OK
{
  "from": "2025-12-01",
  "to": "2025-12-31",
  "totalByCurrency": {
    "HUF": 120000.50,
    "EUR": 320.00
  },
  "byCategory": [
    { "category": "Food", "total": 45000.00, "currency": "HUF" },
    { "category": "Transport", "total": 12000.00, "currency": "HUF" }
  ],
  "countsByStatus": {
    "pending": 3,
    "approved": 12,
    "rejected": 1
  }
}
