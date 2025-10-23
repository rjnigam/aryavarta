# Sanskrit Username System

## Overview

We use a sophisticated username generation system based on Sanskrit philosophical terms. Each username is a combination of two meaningful Sanskrit words connected by an underscore.

## Example Usernames

```
karma_purana
vedanta_yogic
dharma_shakti
bhakti_buddha
yoga_satya
moksha_rishi
jnana_vidya
atman_brahman
```

## How It Works

### 1. Word Pool
- 79 Sanskrit terms from Vedic/Yogic philosophy
- Words like: dharma, karma, yoga, moksha, atman, brahman, etc.

### 2. Username Generation
- Uses `generate_usernames.py` to create combinations
- Format: `word1_word2`
- Currently: 6,000 pre-generated unique usernames
- Maximum possible: 79 × 79 = 6,241 combinations

### 3. Assignment Process
1. User subscribes
2. System picks random username from pool
3. Checks database for uniqueness
4. If taken, tries another (up to 20 attempts)
5. Assigns first available username

### 4. Database Storage
- Stored in `subscribers.username` column (unique constraint)
- Indexed for fast lookups
- Used for future commenting feature

## Scaling the Pool

If you need more usernames (e.g., for 10,000+ subscribers):

### Option 1: Add More Words
Edit `scripts/sanskrit_words.txt` and add more terms:
```bash
# Add 50 more words to get 129 × 129 = 16,641 combinations
vim scripts/sanskrit_words.txt
```

### Option 2: Regenerate Pool
```bash
cd /Users/rajathnigam/Gurukul
python3 scripts/generate_usernames.py \
  --words scripts/sanskrit_words.txt \
  --out scripts/username_pool.txt \
  --count 15000 \
  --shuffle \
  --seed 108
```

### Option 3: Two Different Word Lists
```bash
# Create adjectives.txt and nouns.txt
python3 scripts/generate_usernames.py \
  --words adjectives.txt nouns.txt \
  --out scripts/username_pool.txt \
  --count 50000 \
  --shuffle
```

## Pool Statistics

- **Current Size**: 6,000 usernames
- **Format**: `sanskrit_word_underscore_sanskrit_word`
- **Uniqueness**: Guaranteed by database constraint
- **Collision Handling**: 20 retry attempts before failing

## Benefits

1. **Meaningful**: Every username has philosophical significance
2. **Unique**: Database enforces uniqueness
3. **Brand-Aligned**: Reinforces Aryavarta's Sanskrit/Vedic theme
4. **Memorable**: Two-word combinations are easier to remember than random strings
5. **Scalable**: Can easily expand to 20M+ usernames if needed

## Future Enhancements

- Allow users to choose from 3-5 available usernames
- Implement username change feature (once per year)
- Add username validation/filtering for inappropriate combinations
- Create themed username categories (yoga, vedanta, tantra, etc.)
