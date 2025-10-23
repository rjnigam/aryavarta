# Database Migration: Add Username Column

## Run this SQL in your Supabase SQL Editor:

```sql
-- Add username column to subscribers table
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;

-- Add index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_username ON subscribers(username);

-- Optional: Generate usernames for existing subscribers
UPDATE subscribers 
SET username = LOWER(SPLIT_PART(name, ' ', 1)) || FLOOR(RANDOM() * 9000 + 1000)::TEXT
WHERE username IS NULL;
```

## What this does:

1. **Adds `username` column**: Stores unique usernames for each subscriber
2. **Creates index**: Improves query performance for username lookups
3. **Backfills data**: Generates usernames for any existing subscribers who don't have one

## After running migration:

Test the subscription flow:
1. Try subscribing with a new email
2. Check that you receive the username in:
   - Success message on the website
   - Welcome email
3. Visit an article and confirm username displays in the "Thanks for Subscribing" section
