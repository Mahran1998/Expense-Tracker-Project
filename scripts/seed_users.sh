#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"

register() {
  local email="$1"
  local name="$2"
  local role="$3"
  curl -sS -X POST "$BASE_URL/api/auth/register" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$email\",\"name\":\"$name\",\"password\":\"Demo123!\",\"role\":\"$role\"}" >/dev/null || true
}

echo "Seeding demo users on: $BASE_URL"

register "employee@demo.local" "Employee One" "employee"
register "manager@demo.local" "Manager One" "manager"
register "accountant@demo.local" "Accountant One" "accountant"

echo "Done. Demo users:"
echo "  employee@demo.local / Demo123!"
echo "  manager@demo.local  / Demo123!"
echo "  accountant@demo.local / Demo123!"
