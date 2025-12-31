#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "Seeding expenses into: $BASE_URL"

post() {
  curl -sS -X POST "$BASE_URL/api/expenses" \
    -H 'Content-Type: application/json' \
    -d "$1"
}

get_id() {
  # Extract _id from JSON without jq
  echo "$1" | sed -n 's/.*"_id":"\([^"]*\)".*/\1/p'
}

patch_status() {
  local id="$1"
  local status="$2"
  curl -sS -X PATCH "$BASE_URL/api/expenses/$id/status" \
    -H 'Content-Type: application/json' \
    -d "{\"status\":\"$status\"}" >/dev/null
}

# Dates (GNU date on Ubuntu)
D1=$(date -I -d "-10 days")
D2=$(date -I -d "-8 days")
D3=$(date -I -d "-6 days")
D4=$(date -I -d "-4 days")
D5=$(date -I -d "-2 days")

resp=$(post "{\"amount\":19.90,\"currency\":\"HUF\",\"date\":\"$D1\",\"vendor\":\"Tesco\",\"category\":\"Food\",\"costCenter\":\"Office\",\"notes\":\"Team lunch\"}")
id1=$(get_id "$resp")

resp=$(post "{\"amount\":129.00,\"currency\":\"HUF\",\"date\":\"$D2\",\"vendor\":\"Mol\",\"category\":\"Fuel\",\"costCenter\":\"Delivery\",\"notes\":\"Company car\"}")
id2=$(get_id "$resp")

resp=$(post "{\"amount\":49.99,\"currency\":\"EUR\",\"date\":\"$D3\",\"vendor\":\"GitHub\",\"category\":\"Subscriptions\",\"costCenter\":\"Engineering\",\"notes\":\"CI tooling\"}")
id3=$(get_id "$resp")

resp=$(post "{\"amount\":12.50,\"currency\":\"HUF\",\"date\":\"$D4\",\"vendor\":\"IKEA\",\"category\":\"Supplies\",\"costCenter\":\"Office\",\"notes\":\"Stationery\"}")
id4=$(get_id "$resp")

resp=$(post "{\"amount\":79.00,\"currency\":\"EUR\",\"date\":\"$D5\",\"vendor\":\"Wizz Air\",\"category\":\"Travel\",\"costCenter\":\"Sales\",\"notes\":\"Client visit\"}")
id5=$(get_id "$resp")

# Approve / reject a couple to make dashboard interesting
patch_status "$id2" "approved"
patch_status "$id4" "rejected"

echo "Seeded IDs:"
echo "  $id1 (submitted)"
echo "  $id2 (approved)"
echo "  $id3 (submitted)"
echo "  $id4 (rejected)"
echo "  $id5 (submitted)"

echo "Done."
