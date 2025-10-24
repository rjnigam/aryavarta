# Phase 5B: Auto-Moderation for Comment Threads

## ✅ What Was Shipped

### 1. Comment-Level Moderation Metadata
- Added `is_hidden`, `hidden_reason`, `hidden_at`, and `moderation_status` columns to the `comments` table.
- Every comment now carries its moderation state directly in the row—no more guesswork when rendering.

### 2. Moderation Event Log (`comment_flags`)
- New `comment_flags` table records why a comment was hidden.
- Supports the following flag types:
  - `auto_dislike_threshold`
  - `auto_banned_phrase`
  - `auto_link_spam`
  - `manual_report`
  - `manual_hide`
- Stores trigger source (`system`, `user`, or `moderator`) and machine-readable metadata for future dashboards.

### 3. Auto-Hide Rules
| Rule | Trigger | Result |
|------|---------|--------|
| 🚫 **Dislike threshold** | `dislikes ≥ 5` **and** `(dislikes - likes) ≥ 3` | Comment auto-hidden, flag recorded as `auto_dislike_threshold` |
| 🚫 **Banned phrase** | Comment text contains words like `idiot`, `spam`, `fake news`, etc. | Comment hidden on submit, flag recorded as `auto_banned_phrase` |
| 🚫 **Link spam** | Comment contains more than 2 external links | Comment hidden on submit, flag recorded as `auto_link_spam` |
| ✅ **Auto-restore** | Dislike delta falls back under thresholds | Comment unhidden (if it was auto-hidden), matching flags marked `resolved` |

### 4. API Enhancements
- `/api/comments/[slug]` now returns moderation fields for each comment and reply.
- `/api/comments/reactions` re-evaluates moderation after every reaction.
  - Returns updated `likeCount`, `dislikeCount`, and moderation metadata in the response payload.
- `/api/comments/[slug]` POST endpoint auto-hides suspicious comments and records a flag immediately.

### 5. UI Updates (`CommentSection.tsx`)
- Hidden comments render a yellow notice card instead of the original text.
- Reaction and reply actions are disabled while hidden.
- Counts stay visible for transparency.
- Optimistic UI still kicks in, but the server response now syncs moderation state instantly while `loadComments()` refreshes in the background.

---

## 🧪 Testing Checklist

### Database Migration
- [ ] Run `/docs/PHASE5B-AUTO-MODERATION.sql` in Supabase SQL Editor.
- [ ] Confirm new columns on `comments` and new `comment_flags` table exist (`SELECT` queries at bottom of SQL file).

### Banned-Phrase Auto-Hide
- [ ] Post a comment containing `idiot` → returns success message "pending moderator review".
- [ ] Comment appears as hidden in UI.
- [ ] `comment_flags` row inserted with `flag_type = auto_banned_phrase`.

### Link Spam Auto-Hide
- [ ] Post comment with three `https://` links → auto-hidden with proper flag.

### Dislike Threshold Auto-Hide
- [ ] Use multiple users (or edit `comment_reactions`) to give a comment ≥5 dislikes and ensure dislike delta ≥3.
- [ ] After the triggering reaction:
  - Comment hides with reason "Auto-hidden due to …".
  - Flag recorded with `flag_type = auto_dislike_threshold` and metadata containing counts.

### Auto-Restore
- [ ] Remove enough dislikes (or add likes) so the delta is <3.
- [ ] Comment automatically becomes visible again and the corresponding flag’s `status` flips to `resolved`.

### UI Behaviour
- [ ] Hidden comments show notice card + reason text (if provided).
- [ ] Reaction buttons absent for hidden comments.
- [ ] Replies remain accessible via expand/collapse controls.

---

## 🚀 Deployment Steps

1. **Prereqs**
   - `SUPABASE_SERVICE_ROLE_KEY` must be set locally and on Vercel (we added this during Phase 5A).
2. **Database Migration**
   - Run `docs/PHASE5B-AUTO-MODERATION.sql` in Supabase.
3. **Local Verification**
   - `npm run dev`
   - Execute the testing checklist above.
4. **Commit & Deploy**
   - `git add .`
   - `git commit -m "feat: add auto moderation for comments (Phase 5B)"`
   - Deploy with `vercel --prod` (or push to `main` if CI/CD is wired).

---

## 📈 What to Monitor Post-Launch
- Volume and reasons of `comment_flags` entries per day.
- Percentage of comments auto-hidden vs. restored—adjust thresholds if legitimate comments are caught.
- Manual override tooling: prepare a simple admin view in Phase 6 to resolve flags faster.
- Watch for new phrases to add to the banned list; the metadata log will help.

---

## 🔜 Next Steps (Phase 5B → 5C)
- Expose a lightweight moderator dashboard (list unresolved flags, allow manual hide/unhide).
- Add a manual report button so subscribers can flag bad content directly (`flag_type = manual_report`).
- Introduce email/slack notifications when flags spike.
- Wire auto-moderation outcomes into analytics to inform community health reporting.
