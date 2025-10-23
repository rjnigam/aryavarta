#!/bin/bash

# ========================================
# PHASE 4 DEPLOYMENT SCRIPT
# ========================================
# This script will guide you through deploying the comment replies feature

echo "🚀 Phase 4: Comment Replies Deployment"
echo "======================================="
echo ""

# Step 1: Database Migration
echo "📊 STEP 1: Database Migration"
echo "------------------------------"
echo "1. Open your Supabase Dashboard"
echo "2. Go to SQL Editor"
echo "3. Copy the contents of: docs/RUN-THIS-IN-SUPABASE.sql"
echo "4. Paste and click 'Run'"
echo "5. Verify you see: parent_comment_id | uuid | YES | NULL"
echo ""
read -p "✅ Have you completed the database migration? (y/n) " db_done

if [ "$db_done" != "y" ]; then
    echo "❌ Please complete the database migration first!"
    exit 1
fi

echo ""
echo "✅ Database migration complete!"
echo ""

# Step 2: Local Testing
echo "🧪 STEP 2: Local Testing"
echo "------------------------"
echo "Let's start the development server and test..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Starting development server..."
echo "   → Open http://localhost:3000 in your browser"
echo "   → Navigate to any article"
echo "   → Test posting comments and replies"
echo ""
echo "Test cases to try:"
echo "  1. Post a top-level comment"
echo "  2. Click 'Reply' on your comment"
echo "  3. Submit a reply (should appear indented)"
echo "  4. Click 'Reply' on the reply (test nesting)"
echo "  5. Click 'Cancel' on a reply form"
echo ""

# Start dev server (user will need to Ctrl+C when done)
npm run dev &
DEV_PID=$!

echo ""
read -p "✅ Have you tested locally and everything works? (y/n) " test_done

# Kill dev server
kill $DEV_PID 2>/dev/null

if [ "$test_done" != "y" ]; then
    echo "❌ Please test locally first!"
    echo "   Run: npm run dev"
    exit 1
fi

echo ""
echo "✅ Local testing complete!"
echo ""

# Step 3: Commit Changes
echo "📝 STEP 3: Commit Changes"
echo "-------------------------"
echo "Let's commit all the changes..."
echo ""

git add .
git status

echo ""
read -p "✅ Ready to commit? (y/n) " commit_ready

if [ "$commit_ready" != "y" ]; then
    echo "❌ Please review the changes first!"
    exit 1
fi

git commit -m "feat: Add threaded comment replies system (Phase 4)

- Add parent_comment_id column to comments table
- Update API endpoints to support nested replies
- Create recursive CommentWithReplies component
- Add inline reply forms with cancel option
- Implement tree-building algorithm for comment organization
- Add visual indentation for reply hierarchy
- Include comprehensive documentation"

echo ""
echo "✅ Changes committed!"
echo ""

# Step 4: Deploy
echo "🚀 STEP 4: Deploy to Production"
echo "-------------------------------"
echo ""
echo "Choose your deployment method:"
echo "  1) Push to Git (if you have Vercel/Netlify auto-deploy)"
echo "  2) Deploy with Vercel CLI"
echo ""
read -p "Enter choice (1 or 2): " deploy_choice

if [ "$deploy_choice" == "1" ]; then
    echo ""
    echo "📤 Pushing to Git..."
    git push origin main
    echo ""
    echo "✅ Pushed to Git!"
    echo "   → Check your hosting dashboard for deployment status"
    
elif [ "$deploy_choice" == "2" ]; then
    echo ""
    echo "📤 Deploying with Vercel..."
    vercel --prod
    echo ""
    echo "✅ Deployed to Vercel!"
    
else
    echo "❌ Invalid choice!"
    exit 1
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "📋 Post-Deployment Checklist:"
echo "  1. Open your production site"
echo "  2. Navigate to an article"
echo "  3. Test posting a comment"
echo "  4. Test posting a reply"
echo "  5. Verify nesting works correctly"
echo "  6. Check mobile responsiveness"
echo ""
echo "📊 Monitor:"
echo "  - Reply submission rate"
echo "  - Average reply depth"
echo "  - User engagement time"
echo "  - Error rates in logs"
echo ""
echo "📚 Documentation:"
echo "  - Full guide: docs/PHASE4-DEPLOYMENT-CHECKLIST.md"
echo "  - Visual guide: docs/PHASE4-VISUAL-GUIDE.md"
echo "  - Summary: docs/PHASE4-SUMMARY.md"
echo ""
echo "🔄 Rollback (if needed):"
echo "  Frontend: cp components/CommentSection-backup-phase3.tsx components/CommentSection.tsx"
echo "  Git: git revert HEAD"
echo ""
echo "✨ You now have threaded comment discussions!"
echo ""
