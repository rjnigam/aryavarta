# 📝 Publishing Articles - Simple Guide

Your Gurukul platform now supports **Markdown-based articles**! This makes publishing as easy as writing a text file.

## 🚀 Quick Start: Publish Your First Article

### Method 1: Create Markdown File (Easiest!)

1. **Create a new file** in `/content/articles/`:
   ```bash
   touch content/articles/my-new-article.md
   ```

2. **Add frontmatter and content:**
   ```markdown
   ---
   title: "Your Article Title"
   slug: "your-article-slug"
   source: "Bhagavad Gita"
   readTime: "5 min"
   date: "2025-10-22"
   excerpt: "Brief description that appears in previews..."
   author: "Gurukul Editorial Team"
   tags: ["Bhagavad Gita", "Philosophy", "Modern Life"]
   ---

   ## Your Content Here

   Write your article in markdown...
   ```

3. **That's it!** The article will automatically appear on your site!

---

## 📋 Frontmatter Fields Explained

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ Yes | Article title | "Dharma in the Modern Workplace" |
| `slug` | ✅ Yes | URL-friendly version | "dharma-modern-work" |
| `source` | ✅ Yes | Which text it's from | "Bhagavad Gita", "Upanishads" |
| `readTime` | ✅ Yes | Estimated reading time | "5 min", "10 min" |
| `date` | ✅ Yes | Publication date | "2025-10-22" (YYYY-MM-DD) |
| `excerpt` | ✅ Yes | Preview text | Brief 1-2 sentence summary |
| `author` | ✅ Yes | Author name | "Gurukul Editorial Team" |
| `tags` | ✅ Yes | Array of tags | ["Bhagavad Gita", "Career"] |

---

## ✍️ Markdown Formatting Guide

### Headers
```markdown
## Main Section (H2)
### Subsection (H3)
#### Smaller Heading (H4)
```

### Emphasis
```markdown
**Bold text**
*Italic text*
***Bold and italic***
```

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Quotes (for sacred text citations)
```markdown
> "Quote text here"  
> — Bhagavad Gita 3.35
```

### Links
```markdown
[Link text](https://example.com)
```

### Code (for Sanskrit terms)
```markdown
Inline `dharma` code

\`\`\`
Code block
\`\`\`
```

### Horizontal Rule
```markdown
---
```

---

## 📄 Converting PDF to Markdown

### Option 1: Manual Conversion (Most Control)

1. **Copy text from PDF**
2. **Paste into your markdown file**
3. **Add formatting:**
   - Add `##` before section titles
   - Add `>` before quotes
   - Format lists with `-` or `1.`
   - Add **bold** and *italics* as needed

4. **Add frontmatter at the top**

**Time:** 15-30 minutes per article
**Quality:** Highest (you control everything)

### Option 2: Use Online Converters

**Tools:**
- [PDF to Markdown](https://pdf2md.morethan.io/)
- [Aspose PDF to MD](https://products.aspose.app/pdf/conversion/pdf-to-md)
- [CloudConvert](https://cloudconvert.com/pdf-to-md)

**Steps:**
1. Upload your PDF
2. Download markdown file
3. Clean up formatting
4. Add frontmatter
5. Save to `/content/articles/`

**Time:** 10-15 minutes per article
**Quality:** Good (requires cleanup)

### Option 3: Use AI (ChatGPT, Claude)

1. **Copy text from PDF**
2. **Paste into ChatGPT/Claude with this prompt:**

```
Convert this article to markdown format. Add proper headers (##), 
format quotes as blockquotes (>), maintain lists, and emphasize 
key terms with bold. Keep all Sanskrit terms and citations.

[PASTE YOUR TEXT HERE]
```

3. **Copy the output**
4. **Add frontmatter**
5. **Review and adjust**

**Time:** 5-10 minutes per article
**Quality:** Very Good (AI understands context)

---

## 🎯 Publishing Workflow

### Local Development
```bash
# 1. Create article
vim content/articles/my-article.md

# 2. Preview locally
npm run dev
# Visit http://localhost:3000

# 3. Check it looks good
# Visit http://localhost:3000/articles/my-article-slug
```

### Deploy to Production
```bash
# 1. Commit your article
git add content/articles/my-article.md
git commit -m "Add new article: My Article Title"

# 2. Push to GitHub
git push

# 3. Vercel auto-deploys (if connected)
# Or manually deploy: vercel --prod
```

**Live in:** ~2 minutes! 🚀

---

## 📂 File Organization

```
content/
└── articles/
    ├── dharma-modern-work.md          # Article 1
    ├── upanishadic-self.md            # Article 2
    ├── your-new-article.md            # Article 3
    └── another-article.md             # Article 4
```

**Naming convention:**
- Use lowercase
- Separate words with hyphens
- Keep it short but descriptive
- Example: `karma-yoga-productivity.md`

---

## ✅ Pre-Publish Checklist

Before publishing, verify:

- [ ] Frontmatter is complete (all required fields)
- [ ] Date is in YYYY-MM-DD format
- [ ] Slug matches filename (without .md)
- [ ] Excerpt is 1-2 sentences, compelling
- [ ] Tags are relevant and consistent
- [ ] All Sanskrit terms are explained
- [ ] Quotes have proper citations
- [ ] Headers are properly nested (H2 → H3 → H4)
- [ ] No broken links
- [ ] Proofread for typos
- [ ] Read time is accurate

---

## 🎨 Styling Tips

Your markdown automatically gets beautiful styling:

- **Headers** are bold and spaced
- **Quotes** get orange border and background
- **Lists** are properly indented
- **Code** gets syntax highlighting
- **Links** are orange and underlined
- **Images** (if added) are responsive

No need to add HTML or CSS!

---

## 🔥 Pro Tips

### 1. Draft Articles
Create articles with future dates. They'll be included but sorted correctly.

### 2. Update Articles
Just edit the markdown file and push. Changes go live immediately.

### 3. Delete Articles
Remove the markdown file, commit, and push.

### 4. Reorder on Homepage
Articles are auto-sorted by date (newest first). Change the date to reorder.

### 5. Featured Articles
The homepage shows the 6 most recent articles. To feature an old article, update its date.

---

## 📚 Example Article Template

Save this as a starting point:

```markdown
---
title: "Your Compelling Title Here"
slug: "url-friendly-slug"
source: "Bhagavad Gita"
readTime: "7 min"
date: "2025-10-22"
excerpt: "One or two sentences that hook the reader and explain what they'll learn..."
author: "Gurukul Editorial Team"
tags: ["Tag1", "Tag2", "Tag3"]
---

## Opening Hook

Start with a relatable modern problem or question...

## The Ancient Context

Introduce the scripture and historical background...

## Core Teaching

Deep dive into the concept...

### Practical Application 1

How to apply this in daily life...

### Practical Application 2

Another modern example...

## Reflection Questions

- Question that prompts introspection
- Another thoughtful question
- One more for deep thinking

---

*Closing thought that ties it all together.*
```

---

## 🆘 Troubleshooting

**Article not showing up?**
- Check frontmatter syntax (YAML is picky about spacing)
- Verify the slug is unique
- Make sure file is in `/content/articles/`
- Restart dev server: `npm run dev`

**Formatting looks wrong?**
- Check markdown syntax
- Ensure headers have space after `##`
- Lists need empty line before/after

**Build error?**
- Check for special characters in frontmatter
- Ensure date is in YYYY-MM-DD format
- Verify all required fields are present

---

## 🎉 You're Ready!

Publishing is now as simple as:
1. Write markdown file
2. Add frontmatter
3. Save to `/content/articles/`
4. Push to GitHub
5. **Live!** 🚀

**No database. No admin panel. No complexity.**

Just beautiful articles, beautifully simple. ✨
