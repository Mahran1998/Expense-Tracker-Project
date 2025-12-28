#!/usr/bin/env bash
set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-http://localhost:8080/}"
API_HEALTH_URL="${API_HEALTH_URL:-http://localhost:8080/api/health}"
RABBIT_UI_URL="${RABBIT_UI_URL:-http://localhost:15672/}"

echo "== Smoke test =="

echo "[1/3] Frontend: $FRONTEND_URL"
code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [[ "$code" != "200" ]]; then
  echo "FAIL: frontend HTTP $code"
  exit 1
fi
echo "OK: frontend HTTP $code"

echo "[2/3] API health via proxy: $API_HEALTH_URL"
body=$(curl -s "$API_HEALTH_URL" || true)
if [[ "$body" != "OK" ]]; then
  echo "FAIL: expected body 'OK' got: '$body'"
  exit 1
fi
echo "OK: api health body '$body'"

echo "[3/3] RabbitMQ management UI: $RABBIT_UI_URL"
code=$(curl -s -o /dev/null -w "%{http_code}" "$RABBIT_UI_URL")
# rabbitmq mgmt often returns 200 or 302
if [[ "$code" != "200" && "$code" != "302" ]]; then
  echo "WARN: RabbitMQ UI HTTP $code (continuing)"
else
  echo "OK: rabbitmq ui HTTP $code"
fi

echo "✅ Smoke test passed"
