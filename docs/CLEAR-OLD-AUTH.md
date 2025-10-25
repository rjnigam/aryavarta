# Clear Old Authentication Data

## Problem
The old authentication system used localStorage to store user data. This is causing stale usernames to appear even when users are logged out.

## Solution
Users need to clear their browser's localStorage to remove old authentication data.

### How to Clear localStorage

1. **Open Browser Developer Tools**
   - Chrome/Edge: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Firefox: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Safari: Enable Developer menu, then press `Cmd+Option+I`

2. **Go to Console Tab**

3. **Run this command:**
   ```javascript
   localStorage.clear()
   ```

4. **Refresh the page** (`Cmd+R` or `Ctrl+R`)

### What This Does
- Removes old authentication tokens stored in localStorage
- Clears stale username data
- Forces the app to use the new Supabase Auth system

### After Clearing
- The homepage should show the default "Explore Our Latest Articles" view for logged-out users
- You can sign in again to see personalized content with the correct username

## Alternative: Use Incognito/Private Mode
If you want to test without clearing your localStorage:
- Open an Incognito/Private browsing window
- Navigate to localhost:3000
- The site will use fresh localStorage
