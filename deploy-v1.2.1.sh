#!/bin/bash
# Deploy script for v1.2.1 - Username Mismatch Fix

echo "🚨 Deploying Critical Fix: Username Mismatch Bug (v1.2.1)"
echo "=========================================================="
echo ""

# Check git status
echo "📋 Current git status:"
git status
echo ""

# Add all changes
echo "➕ Adding all changes..."
git add .
echo ""

# Show what will be committed
echo "📝 Changes to be committed:"
git status --short
echo ""

# Create commit
echo "💾 Creating commit..."
git commit -m "Critical Fix: Resolve username mismatch between email and UI (v1.2.1)

CRITICAL BUG FIX:
- Fixed username mismatch where verification email showed different username than post-login UI
- Example: Email showed 'bhakti_shruti-960' but UI showed '@jnana_nadi' after login

Root Cause:
- Subscriber record was not created during signup
- Login flow regenerated username instead of using the one from signup metadata
- Race condition between email sent and database record creation

The Fix:
1. Signup now creates subscriber record immediately with the generated username
2. Login flow improved to always prefer username from auth metadata
3. Added logging to track username source for debugging

Changes:
- app/api/auth/signup/route.ts: Create subscriber record at signup
- app/api/auth/login/route.ts: Better metadata handling + logging
- docs/USERNAME-MISMATCH-FIX-OCT25.md: Detailed technical documentation
- CHANGELOG.md: Updated with v1.2.1 release notes
- docs/project-ops/progress-history.md: Added fix to history

Impact:
- ✅ New signups will have consistent usernames
- ✅ Backward compatible - existing users unaffected
- ✅ No database migration required
- ✅ Better error handling and logging

Severity: CRITICAL - User experience bug
Status: FIXED

Closes: USERNAME-MISMATCH-BUG"

echo ""

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main
echo ""

echo "✅ Critical fix deployed!"
echo ""
echo "🌐 Next steps:"
echo "   1. Vercel will auto-deploy (~2-3 minutes)"
echo "   2. Monitor deployment at: https://vercel.com/dashboard"
echo "   3. Test at: https://arya-varta.in"
echo ""
echo "🧪 Test with NEW signup:"
echo "   1. Sign up with new email"
echo "   2. Note username in verification email"
echo "   3. Verify email and log in"
echo "   4. ✅ Username should match email exactly"
echo ""
echo "📊 Monitor server logs for:"
echo "   - 'Failed to create subscriber record' (should be rare)"
echo "   - 'Creating subscriber record for first login' with usernameSource"
echo ""
