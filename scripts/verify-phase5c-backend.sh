#!/bin/bash

# ========================================
# Phase 5C Backend Verification Script
# ========================================
# Run after applying the SQL migration to verify the new APIs work locally.

echo "🧪 Phase 5C Backend Verification"
echo "===================================="
echo ""

BASE_URL="${1:-http://localhost:3000}"

echo "Testing against: $BASE_URL"
echo ""

echo "1️⃣  Testing /api/moderation/queue..."
QUEUE_RESPONSE=$(curl -s "${BASE_URL}/api/moderation/queue?limit=2&window=7d")
if echo "$QUEUE_RESPONSE" | grep -q '"items"'; then
  echo "   ✅ Queue endpoint working"
  echo "   Sample: $(echo "$QUEUE_RESPONSE" | head -c 200)..."
else
  echo "   ❌ Queue endpoint failed:"
  echo "   $QUEUE_RESPONSE"
fi

echo ""
echo "2️⃣  Testing /api/moderation/metrics..."
METRICS_RESPONSE=$(curl -s "${BASE_URL}/api/moderation/metrics?window=24h")
if echo "$METRICS_RESPONSE" | grep -q '"summary"'; then
  echo "   ✅ Metrics endpoint working"
  echo "   Sample: $(echo "$METRICS_RESPONSE" | head -c 200)..."
else
  echo "   ❌ Metrics endpoint failed:"
  echo "   $METRICS_RESPONSE"
fi

echo ""
echo "3️⃣  Testing /api/moderation/activity..."
ACTIVITY_RESPONSE=$(curl -s "${BASE_URL}/api/moderation/activity?limit=3")
if echo "$ACTIVITY_RESPONSE" | grep -q '"items"'; then
  echo "   ✅ Activity endpoint working"
  echo "   Sample: $(echo "$ACTIVITY_RESPONSE" | head -c 200)..."
else
  echo "   ❌ Activity endpoint failed:"
  echo "   $ACTIVITY_RESPONSE"
fi

echo ""
echo "===================================="
echo "Verification complete!"
echo ""
