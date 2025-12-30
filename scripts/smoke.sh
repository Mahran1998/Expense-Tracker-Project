#!/usr/bin/env bash
set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-http://localhost:8080/}"
API_HEALTH_URL="${API_HEALTH_URL:-http://localhost:8080/api/health}"
RABBIT_UI_URL="${RABBIT_UI_URL:-http://localhost:15672/}"

RETRIES="${RETRIES:-30}"
SLEEP_SEC="${SLEEP_SEC:-2}"
CHECK_RABBIT_UI="${CHECK_RABBIT_UI:-0}"

echo "== Smoke test =="

retry_http_code() {
  local url="$1"
  local expected="$2"
  local i code
  for ((i=1; i<=RETRIES; i++)); do
    code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
    if [[ "$code" == "$expected" ]]; then
      echo "OK: $url -> HTTP $code"
      return 0
    fi
    echo "WAIT: $url -> HTTP $code (try $i/$RETRIES)"
    sleep "$SLEEP_SEC"
  done
  echo "FAIL: $url did not return HTTP $expected after $RETRIES tries"
  return 1
}

retry_body_equals() {
  local url="$1"
  local expected="$2"
  local i body
  for ((i=1; i<=RETRIES; i++)); do
    body=$(curl -s "$url" || true)
    if [[ "$body" == "$expected" ]]; then
      echo "OK: $url -> body '$body'"
      return 0
    fi
    echo "WAIT: $url -> body '$body' (try $i/$RETRIES)"
    sleep "$SLEEP_SEC"
  done
  echo "FAIL: $url body never became '$expected'"
  return 1
}

echo "[1/3] Frontend: $FRONTEND_URL"
retry_http_code "$FRONTEND_URL" "200"

echo "[2/3] API health via proxy: $API_HEALTH_URL"
retry_body_equals "$API_HEALTH_URL" "OK"

if [[ "$CHECK_RABBIT_UI" == "1" ]]; then
  echo "[3/3] RabbitMQ management UI: $RABBIT_UI_URL"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$RABBIT_UI_URL" || true)
  if [[ "$code" != "200" && "$code" != "302" ]]; then
    echo "FAIL: RabbitMQ UI HTTP $code"
    exit 1
  fi
  echo "OK: rabbitmq ui HTTP $code"
else
  echo "[3/3] RabbitMQ management UI: (skipped) set CHECK_RABBIT_UI=1 to enable"
fi

echo "✅ Smoke test passed"
