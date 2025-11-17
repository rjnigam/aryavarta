#!/bin/bash

# ========================================
# PHASE 5A: LIKE/DISLIKE REACTIONS
# ========================================

echo "🎯 Phase 5A: Comment Reactions Deployment"
echo "=========================================="
echo ""

# Step 1: Database Migration
echo "📊 STEP 1: Database Migration"
echo "------------------------------"
echo "1. Open your Supabase Dashboard"
echo "2. Go to SQL Editor"
echo "3. Copy the contents of: docs/PHASE5A-REACTIONS-MIGRATION.sql"
echo "4. Paste and click 'Run'"
echo "5. Verify you see: id, comment_id, user_email, reaction_type, created_at"
echo ""
read -p "✅ Have you completed the database migration? (y/n) " db_done

if [ "$db_done" != "y" ]; then
    echo "❌ Please complete the database migration first!"
    exit 1
fi

echo ""
echo "✅ Database migration complete!"
echo ""

# Step 2: Test Locally
echo "🧪 STEP 2: Local Testing"
echo "------------------------"
echo "The dev server should already be running."
echo "Open http://localhost:3000 and navigate to any article with comments."
echo ""
echo "Test these scenarios:"
echo "  1. ✅ Like a comment (not your own)"
echo "  2. ✅ Click like again to unlike"
echo "  3. ✅ Like a comment, then dislike it (switch)"
echo "  4. ✅ Post your own comment (no reaction buttons appear)"
echo "  5. ✅ React to nested replies"
echo "  6. ✅ Logout and verify you only see counts"
echo ""
read -p "✅ Have you tested all scenarios? (y/n) " test_done

if [ "$test_done" != "y" ]; then
    echo "❌ Please test locally first!"
    exit 1
fi

echo ""
echo "✅ Local testing complete!"
echo ""

# Step 3: Commit and Deploy
echo "🚀 STEP 3: Commit and Deploy"
echo "-----------------------------"
echo ""

git add .
git status

echo ""
read -p "✅ Ready to commit and deploy? (y/n) " deploy_ready

if [ "$deploy_ready" != "y" ]; then
    echo "❌ Please review the changes first!"
    exit 1
fi

git commit -m "feat: Add like/dislike reactions to comments (Phase 5A)

- Create comment_reactions table with unique constraint
- Add reaction API endpoints (GET/POST)
- Update CommentSection UI with like/dislike buttons
- Implement toggle and switch behavior
- Enforce no self-reactions rule
- Add reaction counts to all comments and replies
- Include comprehensive documentation"

echo ""
echo "📤 Deploying to production..."
echo ""

# Choose deployment method
echo "Choose deployment method:"
echo "  1) Push to Git (auto-deploy)"
echo "  2) Deploy with Vercel CLI"
echo ""
read -p "Enter choice (1 or 2): " deploy_choice

if [ "$deploy_choice" == "1" ]; then
    git push origin main
    echo ""
    echo "✅ Pushed to Git! Check your hosting dashboard for deployment status."
elif [ "$deploy_choice" == "2" ]; then
    vercel --prod
    echo ""
    echo "✅ Deployed with Vercel!"
else
    echo "❌ Invalid choice!"
    exit 1
fi

echo ""
echo "🎉 PHASE 5A DEPLOYMENT COMPLETE!"
echo "================================"
echo ""
echo "✅ What you just shipped:"
echo "  - Like/Dislike buttons on all comments"
echo "  - Smart toggle and switch behavior"
echo "  - No self-reactions enforcement"
echo "  - Reaction counts for all users"
echo ""
echo "📊 Now Collecting Data For:"
echo "  - Like vs dislike patterns"
echo "  - Comment engagement rates"
echo "  - Spam detection (Phase 5B prep)"
echo ""
echo "📚 Documentation:"
echo "  - Summary: docs/PHASE5A-SUMMARY.md"
echo "  - Visual Guide: docs/PHASE5A-VISUAL-GUIDE.md"
echo "  - Migration SQL: docs/PHASE5A-REACTIONS-MIGRATION.sql"
echo ""
echo "🔜 Next Phase:"
echo "  Phase 5B - Auto-Moderation (after 1-2 weeks of data)"
echo ""
echo "✨ Users can now like and dislike comments!"
echo ""
