#!/bin/bash

# ========================================
# PHASE 5B: AUTO-MODERATION DEPLOYMENT
# ========================================

echo "🛡️  Phase 5B: Auto-Moderation Deployment"
echo "============================================"
echo ""

echo "📊 STEP 1: Database Migration"
echo "--------------------------------------------"
echo "1. Open your Supabase Dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy / paste docs/PHASE5B-AUTO-MODERATION.sql"
echo "4. Click 'Run' and confirm new columns + tables"
echo "   - comments.is_hidden, hidden_reason, hidden_at, moderation_status"
echo "   - comment_flags table"
echo ""
read -p "✅ Migration applied successfully? (y/n) " migration_done

if [ "$migration_done" != "y" ]; then
  echo "❌ Please run the migration before deploying!"
  exit 1
fi

echo ""
echo "🧪 STEP 2: Local Testing"
echo "--------------------------------------------"
echo "Make sure your dev server is running: npm run dev"
echo "Then validate these scenarios:"
echo "  1. 🚫 Banned phrase hides comment (e.g. contains 'idiot' or 'spam')"
echo "  2. 🧵 Hidden comment shows notice card + disabled actions"
echo "  3. 🔗 3+ links triggers auto hide"
echo "  4. 👎 5 dislikes with large delta auto-hides the comment"
echo "  5. ✅ Removing dislikes auto-restores the comment"
echo ""
read -p "✅ All scenarios verified locally? (y/n) " tests_passed

if [ "$tests_passed" != "y" ]; then
  echo "❌ Please finish local testing before deploying!"
  exit 1
fi

echo ""
echo "📝 STEP 3: Review & Commit"
echo "--------------------------------------------"

git add .
git status

echo ""
read -p "✅ Ready to commit Phase 5B changes? (y/n) " ready_to_commit

if [ "$ready_to_commit" != "y" ]; then
  echo "❌ Review outstanding changes before committing."
  exit 1
fi

commit_message="feat: add auto moderation for comments (Phase 5B)"

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
echo "🎉 Phase 5B Deployment Complete"
echo "============================================"
echo "✅ Auto-hide rules now protect your comment threads"
echo "✅ Moderation flags are recorded for future dashboards"
echo ""
echo "📚 Docs:"
echo "  - Summary: docs/PHASE5B-AUTO-MODERATION.md"
echo "  - Migration: docs/PHASE5B-AUTO-MODERATION.sql"
echo ""
echo "🔭 Coming Up:"
echo "  Phase 5C - Manual reports & moderator dashboard"
echo ""
