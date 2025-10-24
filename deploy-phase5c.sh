#!/bin/bash

# ========================================
# PHASE 5C: MODERATION BACKEND DEPLOYMENT
# ========================================

echo "🛡️  Phase 5C: Moderation Backend Deployment"
echo "============================================"
echo ""

echo "📊 STEP 1: Database Migration"
echo "--------------------------------------------"
echo "1. Open your Supabase Dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Run docs/PHASE5C-MODERATION-BACKEND.sql"
echo "   - Adds assigned_to, notes, last_touched_by, last_touched_at columns"
echo "   - Creates created_at indexes for queue + metrics endpoints"
echo ""
read -p "✅ Migration applied successfully? (y/n) " migration_done

if [ "$migration_done" != "y" ]; then
  echo "❌ Please apply the migration before deploying!"
  exit 1
fi

echo ""
echo "🧪 STEP 2: Local Smoke Tests"
echo "--------------------------------------------"
echo "1. Start dev server in another shell: npm run dev"
echo "2. Hit the new endpoints (examples):"
echo "   curl 'http://localhost:3000/api/moderation/queue?limit=3'"
echo "   curl 'http://localhost:3000/api/moderation/metrics?window=7d'"
echo "   curl 'http://localhost:3000/api/moderation/activity?limit=5'"
echo "3. Verify responses include real Supabase data"
echo ""
read -p "✅ Endpoints returning expected data? (y/n) " tests_passed

if [ "$tests_passed" != "y" ]; then
  echo "❌ Fix issues before deploying."
  exit 1
fi

echo ""
echo "📝 STEP 3: Review & Commit"
echo "--------------------------------------------"

git add .
git status

echo ""
read -p "✅ Ready to commit Phase 5C backend changes? (y/n) " ready_to_commit

if [ "$ready_to_commit" != "y" ]; then
  echo "❌ Review outstanding changes before committing."
  exit 1
fi

commit_message="feat: add moderation dashboard backend (Phase 5C)"

git commit -m "$commit_message"

echo ""
echo "🚀 STEP 4: Deploy"
echo "--------------------------------------------"
echo "Choose deployment method:"
echo "  1) Push to Git (auto deploy)"
echo "  2) Deploy with Vercel CLI"
echo ""
read -p "Enter choice (1 or 2): " deploy_choice

if [ "$deploy_choice" == "1" ]; then
  git push origin main
  echo ""
  echo "✅ Pushed to main. Monitor Vercel for deployment status."
elif [ "$deploy_choice" == "2" ]; then
  vercel --prod
  echo ""
  echo "✅ Deployed with Vercel!"
else
  echo "❌ Invalid choice!"
  exit 1
fi

echo ""
echo "🎉 Phase 5C Backend Deployment Complete"
echo "============================================"
echo "✅ Moderation queue & metrics API live"
echo "✅ Dashboard can now fetch real moderation data"
echo ""
echo "📚 Docs:"
echo "  - Summary: docs/PHASE5C-MODERATION-BACKEND.md"
echo "  - Migration: docs/PHASE5C-MODERATION-BACKEND.sql"
echo ""
echo "🔭 Next: Wire the /moderation UI to these endpoints."
echo ""
