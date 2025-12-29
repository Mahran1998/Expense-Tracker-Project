# Validation commands (MVP)

Base URL:
- http://localhost:8080/api

## Create
curl -s -X POST http://localhost:8080/api/expenses \
  -H 'Content-Type: application/json' \
  -d '{"amount":19.9,"currency":"HUF","date":"2025-12-29","vendor":"Tesco","category":"Food","costCenter":"Office","notes":"Team lunch"}' | jq .

## List (date range)
curl -s "http://localhost:8080/api/expenses?from=2025-12-01&to=2025-12-31" | jq .

## Approve (replace <ID>)
curl -s -X PATCH http://localhost:8080/api/expenses/<ID>/status \
  -H 'Content-Type: application/json' \
  -d '{"status":"approved"}' | jq .

## Summary
curl -s "http://localhost:8080/api/reports/summary?from=2025-12-01&to=2025-12-31" | jq .
