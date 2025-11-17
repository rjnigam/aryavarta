#!/bin/bash
# Deploy script for v1.2.0 - Login Flow Fix & Missing Routes

echo "🚀 Deploying Aryavarta v1.2.0 - Login Flow Fix"
echo "=============================================="
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
git commit -m "Fix: Resolve login flow race condition and add missing routes (v1.2.0)

Critical Fixes:
- Fixed login flow to use window.location.href for immediate session recognition
- Eliminated delay where users saw Sign in/Sign up after successful login
- Resolved race condition between router navigation and AuthContext loading

New Routes Added:
- /profile - User profile page with account information
- /settings - Settings page with placeholders for future features
- /my-comments - Comment history page (empty state)

All new pages include:
- Auth protection with login redirect
- Loading states
- Dharmic design system styling
- Coming soon messaging for unimplemented features

Documentation:
- Added docs/LOGIN-FLOW-FIX-OCT25.md with technical details
- Updated CHANGELOG.md with v1.2.0 release notes
- Updated docs/project-ops/progress-history.md

This resolves:
- User confusion after login
- 404 console errors for user menu links
- Poor UX with delayed auth state updates

Closes: AUTH-001, UX-404-ERRORS"

echo ""

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main
echo ""

echo "✅ Deploy complete!"
echo ""
echo "🌐 Next steps:"
echo "   1. Vercel will auto-deploy from main branch (~2-3 minutes)"
echo "   2. Monitor deployment at: https://vercel.com/dashboard"
echo "   3. Test production at: https://arya-varta.in"
echo ""
echo "🔍 Test checklist:"
echo "   ✓ Login shows user menu immediately"
echo "   ✓ No 404 errors in console"
echo "   ✓ /profile page loads"
echo "   ✓ /settings page loads"
echo "   ✓ /my-comments page loads"
echo ""
