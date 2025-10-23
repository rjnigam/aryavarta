# Comment Replies - Visual Guide

## How It Works

### Before (Phase 3) - Flat Comments
```
┌─────────────────────────────────────┐
│ Comment by dharma_vedic             │
│ "Great article on Vedic philosophy" │
│ 2 hours ago                         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Comment by karma_shakti             │
│ "I agree completely!"               │
│ 1 hour ago                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Comment by yoga_purana              │
│ "Can you elaborate on..."           │
│ 30 minutes ago                      │
└─────────────────────────────────────┘
```

### After (Phase 4) - Threaded Replies
```
┌─────────────────────────────────────┐
│ Comment by dharma_vedic             │
│ "Great article on Vedic philosophy" │
│ 2 hours ago                         │
│ [Reply]                             │
└─────────────────────────────────────┘
    ┌─────────────────────────────────┐
    │ ↳ Reply by karma_shakti         │
    │ "I agree completely!"           │
    │ 1 hour ago                      │
    │ [Reply]                         │
    └─────────────────────────────────┘
        ┌─────────────────────────────┐
        │ ↳ Reply by yoga_purana      │
        │ "Can you elaborate on..."   │
        │ 30 minutes ago              │
        │ [Reply]                     │
        └─────────────────────────────┘
            ┌─────────────────────────┐
            │ ↳ Reply by dharma_vedic │
            │ "Sure! Let me explain..." │
            │ 10 minutes ago          │
            │ [Reply]                 │
            └─────────────────────────┘

┌─────────────────────────────────────┐
│ Comment by sanskriti_atma           │
│ "Different perspective here..."     │
│ 45 minutes ago                      │
│ [Reply]                             │
└─────────────────────────────────────┘
    ┌─────────────────────────────────┐
    │ ↳ Reply by vedanta_yogic        │
    │ "Interesting point!"            │
    │ 20 minutes ago                  │
    │ [Reply]                         │
    └─────────────────────────────────┘
```

## User Flow

### Posting a Reply

**Step 1**: User sees a comment they want to reply to
```
┌────────────────────────────────────────────┐
│ Comment by dharma_vedic                    │
│ "What are your thoughts on this topic?"    │
│ 1 hour ago                                 │
│ [Reply] ← User clicks here                 │
└────────────────────────────────────────────┘
```

**Step 2**: Reply form appears inline
```
┌────────────────────────────────────────────┐
│ Comment by dharma_vedic                    │
│ "What are your thoughts on this topic?"    │
│ 1 hour ago                                 │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ Write your reply...                    │ │
│ │ [textarea with 3 rows]                 │ │
│ │                                        │ │
│ │ [Post Reply] [Cancel]                  │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Step 3**: User types reply and clicks "Post Reply"
```
┌────────────────────────────────────────────┐
│ Comment by dharma_vedic                    │
│ "What are your thoughts on this topic?"    │
│ 1 hour ago                                 │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ I think the key principle here is...   │ │
│ │ that we need to consider both the      │ │
│ │ historical and modern context.         │ │
│ │                                        │ │
│ │ [⌛ Posting...] [Cancel]               │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Step 4**: Reply appears nested below parent
```
┌────────────────────────────────────────────┐
│ Comment by dharma_vedic                    │
│ "What are your thoughts on this topic?"    │
│ 1 hour ago                                 │
│ [Reply]                                    │
└────────────────────────────────────────────┘
    ┌────────────────────────────────────────┐
    │ ↳ Reply by karma_yogic                 │
    │ "I think the key principle here is..." │
    │ just now                               │
    │ [Reply]                                │
    └────────────────────────────────────────┘
```

## Visual Hierarchy

### Indentation Levels
```
Level 0 (Top-level comment)
└─ margin-left: 0px

    Level 1 (First reply)
    └─ margin-left: 32px (ml-8)

        Level 2 (Reply to reply)
        └─ margin-left: 64px (ml-16)

            Level 3 (Further nested)
            └─ margin-left: 96px (ml-24)
```

### Color Scheme
```
Background:
- Comment cards: white
- Reply form: gradient (saffron-50 → white → sandalwood-50)
- Borders: saffron-200

Text:
- Username: gray-900 (font-mono, font-semibold)
- Timestamp: gray-500 (text-sm)
- Comment text: gray-700
- Reply button: saffron-700 (hover: saffron-900)

Buttons:
- Post Reply: gradient (saffron-600 → vermillion-600)
- Cancel: border-saffron-300, text-saffron-700
```

## State Management

### React State Variables
```typescript
const [replyingTo, setReplyingTo] = useState<string | null>(null);
const [replyText, setReplyText] = useState('');

// When user clicks Reply button on comment with id "abc123":
setReplyingTo("abc123");  // Shows form for this comment

// When user cancels:
setReplyingTo(null);  // Hides form
setReplyText('');     // Clears text

// When user submits:
handleSubmitReply("abc123");  // Posts with parentCommentId
setReplyingTo(null);          // Hides form
setReplyText('');             // Clears text
```

### API Data Structure

**Request (POST /api/comments/[slug])**:
```json
{
  "email": "user@example.com",
  "username": "dharma_vedic",
  "commentText": "This is my reply",
  "parentCommentId": "abc123"  // Optional - present for replies
}
```

**Response (GET /api/comments/[slug])**:
```json
{
  "comments": [
    {
      "id": "abc123",
      "username": "dharma_vedic",
      "comment_text": "Top level comment",
      "created_at": "2024-01-20T10:00:00Z",
      "replies": [
        {
          "id": "def456",
          "username": "karma_yogic",
          "comment_text": "First reply",
          "created_at": "2024-01-20T11:00:00Z",
          "replies": [
            {
              "id": "ghi789",
              "username": "yoga_purana",
              "comment_text": "Nested reply",
              "created_at": "2024-01-20T12:00:00Z",
              "replies": []
            }
          ]
        }
      ]
    }
  ]
}
```

## Component Structure

### File Organization
```
components/
  ├── CommentSection.tsx (main)
  │   ├── CommentWithReplies (recursive subcomponent)
  │   ├── CommentSection (main exported component)
  │   └── interfaces & state management
  │
  └── CommentSection-backup-phase3.tsx (backup)
```

### Component Props Flow
```
<CommentSection>
  ├── article metadata
  ├── authentication state
  └── <CommentWithReplies> (for each top-level comment)
      ├── comment data
      ├── reply handlers
      ├── depth tracking
      └── <CommentWithReplies> (recursive for replies)
          ├── comment data
          ├── reply handlers
          ├── depth tracking
          └── ... (continues recursively)
```

## Database Relationships

### Entity Relationship
```
┌─────────────┐
│  comments   │
├─────────────┤
│ id (PK)     │───┐
│ article_slug│   │
│ username    │   │
│ comment_text│   │
│ parent_id   │───┘ (self-referencing FK)
│ created_at  │
│ is_deleted  │
└─────────────┘
```

### Query Examples

**Fetch all comments for an article (tree structure built in API)**:
```sql
SELECT * FROM comments
WHERE article_slug = 'article-slug'
AND is_deleted = FALSE
ORDER BY created_at ASC;
```

**Find all replies to a specific comment**:
```sql
SELECT * FROM comments
WHERE parent_comment_id = 'abc123'
AND is_deleted = FALSE
ORDER BY created_at ASC;
```

**Count replies for each top-level comment**:
```sql
SELECT 
  c1.id,
  c1.username,
  COUNT(c2.id) as reply_count
FROM comments c1
LEFT JOIN comments c2 ON c2.parent_comment_id = c1.id
WHERE c1.article_slug = 'article-slug'
  AND c1.parent_comment_id IS NULL
  AND c1.is_deleted = FALSE
GROUP BY c1.id, c1.username;
```

## Testing Scenarios

### Happy Path
1. ✅ Login as subscriber
2. ✅ Post top-level comment
3. ✅ Click Reply on your comment
4. ✅ Type reply text
5. ✅ Submit reply
6. ✅ See reply appear indented
7. ✅ Click Reply on the reply
8. ✅ Post nested reply
9. ✅ See double indentation

### Edge Cases
1. ✅ Cancel reply (form disappears, text cleared)
2. ✅ Reply to different comments (independent threads)
3. ✅ Deep nesting (4+ levels)
4. ✅ Empty reply text (button disabled)
5. ✅ Very long reply text (2000 char limit enforced)
6. ✅ Replying while not authenticated (button hidden)
7. ✅ Network error during submit (error message shown)

### Error Scenarios
1. ❌ Parent comment deleted (API validates, returns error)
2. ❌ Invalid parent_id (API validates, returns error)
3. ❌ Database constraint violation (foreign key enforced)

## Performance Considerations

### Frontend
- **Recursive rendering**: Efficient React recursion with proper keys
- **State management**: Minimal re-renders (only affected branch updates)
- **Memoization**: Could add `React.memo()` for CommentWithReplies if needed

### Backend
- **Tree building**: O(n) complexity with two-pass algorithm
- **Database queries**: Single query fetches all comments/replies
- **Indexes**: Optimized for `article_slug` and `parent_comment_id` lookups

### Database
- **Indexes created**: 
  - `idx_comments_parent_id` - Fast parent lookups
  - `idx_comments_article_parent` - Composite for article filtering
- **Foreign key cascade**: Automatic cleanup of orphaned replies
- **Query plan**: Should use index scans, not full table scans

---

**Ready to deploy!** 🚀

Follow the deployment checklist in `PHASE4-DEPLOYMENT-CHECKLIST.md`
