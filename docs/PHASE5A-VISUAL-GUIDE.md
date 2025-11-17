# Phase 5A: Like/Dislike Reactions - Visual Guide

## How It Works

### Visual States

#### 1. Not Authenticated or Own Comment (Read-Only)
```
┌────────────────────────────────────────┐
│ Comment by dharma_vedic                │
│ "Great insights on this topic!"        │
│ 2 hours ago                            │
│                                        │
│ 👍 12  👎 2                            │
│ (gray icons, not clickable)            │
└────────────────────────────────────────┘
```

#### 2. Not Reacted (Default State)
```
┌────────────────────────────────────────┐
│ Comment by karma_shakti                │
│ "I agree completely!"                  │
│ 1 hour ago                             │
│                                        │
│ 👍 5  👎 1  [Reply]                    │
│ ↑hover  ↑hover   ↑                     │
│ gray → saffron → gray                  │
│ (clickable, changes color on hover)    │
└────────────────────────────────────────┘
```

#### 3. User Liked the Comment
```
┌────────────────────────────────────────┐
│ Comment by yoga_purana                 │
│ "Can you elaborate on this?"           │
│ 30 minutes ago                         │
│                                        │
│ 👍 13  👎 2  [Reply]                   │
│ ↑                                      │
│ FILLED ORANGE (you liked this)         │
│ Click again to unlike                  │
└────────────────────────────────────────┘
```

#### 4. User Disliked the Comment
```
┌────────────────────────────────────────┐
│ Comment by spam_user                   │
│ "Buy cheap products here..."           │
│ 5 minutes ago                          │
│                                        │
│ 👍 0  👎 15  [Reply]                   │
│       ↑                                │
│    FILLED RED (you disliked this)      │
│    Click again to remove               │
└────────────────────────────────────────┘
```

---

## User Interaction Flows

### Flow 1: Like a Comment

**Step 1**: User sees comment they like
```
┌────────────────────────────────────────┐
│ Comment by vedanta_yogic               │
│ "This perfectly explains the concept"  │
│ 1 hour ago                             │
│                                        │
│ 👍 8  👎 0  [Reply]                    │
│ ↑ User clicks here                     │
└────────────────────────────────────────┘
```

**Step 2**: API processes reaction
```
POST /api/comments/reactions
{
  "commentId": "abc-123",
  "userEmail": "user@example.com",
  "reactionType": "like",
  "commentAuthorEmail": "author@example.com"
}

Response: { action: "added", reactionType: "like" }
```

**Step 3**: UI updates
```
┌────────────────────────────────────────┐
│ Comment by vedanta_yogic               │
│ "This perfectly explains the concept"  │
│ 1 hour ago                             │
│                                        │
│ 👍 9  👎 0  [Reply]                    │
│ ↑                                      │
│ FILLED & COUNT +1                      │
└────────────────────────────────────────┘
```

---

### Flow 2: Change Like to Dislike

**Step 1**: Comment user previously liked
```
┌────────────────────────────────────────┐
│ Comment by sanskriti_atma              │
│ "Actually, I disagree because..."      │
│ 20 minutes ago                         │
│                                        │
│ 👍 5  👎 3  [Reply]                    │
│ ↑                                      │
│ FILLED (you liked this)                │
└────────────────────────────────────────┘
```

**Step 2**: User clicks dislike instead
```
┌────────────────────────────────────────┐
│ Comment by sanskriti_atma              │
│ "Actually, I disagree because..."      │
│ 20 minutes ago                         │
│                                        │
│ 👍 5  👎 3  [Reply]                    │
│       ↑ User clicks here               │
└────────────────────────────────────────┘
```

**Step 3**: API updates existing reaction
```
POST /api/comments/reactions
{
  "commentId": "def-456",
  "userEmail": "user@example.com",
  "reactionType": "dislike",
  "commentAuthorEmail": "author@example.com"
}

Response: { action: "updated", reactionType: "dislike" }
```

**Step 4**: Both counts change
```
┌────────────────────────────────────────┐
│ Comment by sanskriti_atma              │
│ "Actually, I disagree because..."      │
│ 20 minutes ago                         │
│                                        │
│ 👍 4  👎 4  [Reply]                    │
│ -1     +1                              │
│       ↑                                │
│    FILLED RED                          │
└────────────────────────────────────────┘
```

---

### Flow 3: Toggle Off (Remove Reaction)

**Step 1**: Comment user disliked
```
┌────────────────────────────────────────┐
│ Comment by troll_account               │
│ "Spam spam spam..."                    │
│ 10 minutes ago                         │
│                                        │
│ 👍 0  👎 8  [Reply]                    │
│       ↑                                │
│    FILLED RED (you disliked)           │
└────────────────────────────────────────┘
```

**Step 2**: User clicks dislike again
```
POST /api/comments/reactions
{
  "commentId": "ghi-789",
  "userEmail": "user@example.com",
  "reactionType": "dislike",
  "commentAuthorEmail": "troll@example.com"
}

Response: { action: "removed", reactionType: "dislike" }
```

**Step 3**: Reaction removed
```
┌────────────────────────────────────────┐
│ Comment by troll_account               │
│ "Spam spam spam..."                    │
│ 10 minutes ago                         │
│                                        │
│ 👍 0  👎 7  [Reply]                    │
│       ↑                                │
│    GRAY (not filled) & COUNT -1        │
└────────────────────────────────────────┘
```

---

### Flow 4: Attempt Self-Reaction (Blocked)

**Step 1**: User sees their own comment
```
┌────────────────────────────────────────┐
│ Comment by YOUR_USERNAME               │
│ "Here's my perspective..."             │
│ just now                               │
│                                        │
│ 👍 3  👎 0                             │
│ (no buttons, just counts)              │
└────────────────────────────────────────┘
```

**Why no buttons?**
```typescript
const isOwnComment = userEmail === comment.email;

// In UI:
{isAuthenticated && !isOwnComment && (
  <div>
    <button>👍 Like</button>
    <button>👎 Dislike</button>
  </div>
)}

// If someone tries via API:
if (userEmail === commentAuthorEmail) {
  return { message: 'You cannot react to your own comment', status: 403 };
}
```

---

## Nested Comments Example

```
Comment by dharma_vedic (Top-level)
"Great article on Vedic philosophy"
2 hours ago
👍 25  👎 1  [Reply]

    ↳ Reply by karma_yogic (1st level)
      "I agree completely!"
      1 hour ago
      👍 12  👎 0  [Reply]
      
        ↳ Reply by yoga_purana (2nd level)
          "Can you elaborate on..."
          30 minutes ago
          👍 8  👎 2  [Reply]
          
            ↳ Reply by dharma_vedic (3rd level)
              "Sure! Let me explain..."
              10 minutes ago
              👍 15  👎 0  [Reply]
```

**Each level has its own reactions:**
- Independent counts
- User can react to each separately
- Cannot react to own comments at any level

---

## Database Structure

### Tables

**comment_reactions**
```
┌──────────────────────────────────────────┐
│ id (UUID)                                │
│ comment_id (UUID) → comments(id)         │
│ user_email (TEXT)                        │
│ reaction_type ('like' or 'dislike')      │
│ created_at (TIMESTAMPTZ)                 │
│                                          │
│ UNIQUE(comment_id, user_email)           │
└──────────────────────────────────────────┘
```

### Example Data

**Scenario: 3 users react to 1 comment**

| id | comment_id | user_email | reaction_type | created_at |
|----|------------|------------|---------------|------------|
| 1  | abc-123    | user1@ex.com | like | 2024-01-20 10:00 |
| 2  | abc-123    | user2@ex.com | like | 2024-01-20 10:05 |
| 3  | abc-123    | user3@ex.com | dislike | 2024-01-20 10:10 |

**Result:**
- Like count: 2
- Dislike count: 1

**What happens if user1 changes to dislike?**

Update row 1:
```sql
UPDATE comment_reactions 
SET reaction_type = 'dislike' 
WHERE id = 1;
```

New result:
- Like count: 1
- Dislike count: 2

**What happens if user2 toggles off?**

Delete row 2:
```sql
DELETE FROM comment_reactions WHERE id = 2;
```

Final result:
- Like count: 0
- Dislike count: 2

---

## API Behavior Matrix

| Current State | User Action | API Behavior | Result |
|---------------|-------------|--------------|--------|
| No reaction | Click like | INSERT new row | Like count +1 |
| No reaction | Click dislike | INSERT new row | Dislike count +1 |
| Liked | Click like again | DELETE row | Like count -1 |
| Liked | Click dislike | UPDATE row | Like -1, Dislike +1 |
| Disliked | Click dislike again | DELETE row | Dislike count -1 |
| Disliked | Click like | UPDATE row | Dislike -1, Like +1 |
| Own comment | Click any | REJECT 403 | No change |

---

## CSS Classes

### Like Button States
```css
/* Default (not reacted) */
.text-gray-500.hover:text-saffron-700

/* User liked */
.text-saffron-700 (with fill-current on icon)

/* Disabled (own comment) */
.text-gray-500 (no hover, not clickable)
```

### Dislike Button States
```css
/* Default (not reacted) */
.text-gray-500.hover:text-red-600

/* User disliked */
.text-red-600 (with fill-current on icon)

/* Disabled (own comment) */
.text-gray-500 (no hover, not clickable)
```

---

## Testing Checklist

### Manual Tests

- [ ] **Like a comment**
  - Click thumbs up
  - Icon fills orange
  - Count increases

- [ ] **Unlike a comment**
  - Click thumbs up again
  - Icon unfills
  - Count decreases

- [ ] **Dislike a comment**
  - Click thumbs down
  - Icon fills red
  - Count increases

- [ ] **Undislike a comment**
  - Click thumbs down again
  - Icon unfills
  - Count decreases

- [ ] **Switch like to dislike**
  - Like a comment
  - Click dislike
  - Like count -1, dislike +1
  - Dislike icon filled

- [ ] **Switch dislike to like**
  - Dislike a comment
  - Click like
  - Dislike count -1, like +1
  - Like icon filled

- [ ] **Own comment (no buttons)**
  - Post a comment
  - See counts but no buttons
  - Cannot react via UI

- [ ] **Nested reply reactions**
  - React to a reply
  - React to reply's reply
  - All work independently

- [ ] **Not authenticated**
  - Logout
  - See counts but no buttons

- [ ] **Page refresh**
  - React to comment
  - Refresh page
  - Reaction persists

### Edge Cases

- [ ] Multiple tabs (same user)
- [ ] Rapid clicking (double-click prevention)
- [ ] Network error handling
- [ ] Very high counts (99+)

---

**Ready to test!** 🎉

1. Run the database migration in Supabase
2. Refresh your browser
3. Try liking and disliking comments
4. Check that you can't react to your own comments
5. Test toggling and switching reactions
