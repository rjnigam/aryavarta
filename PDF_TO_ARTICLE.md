# 📄 PDF to Article - Automated Publishing

## 🎉 You Can Now Paste PDFs and Auto-Publish!

Your Gurukul platform now has **automated PDF-to-article conversion**!

---

## 🚀 Quick Start (3 Steps)

### Step 1: Drop PDF in Folder
```bash
# Put your PDF here:
content/pdfs/your-article.pdf
```

### Step 2: Run Converter
```bash
npm run pdf-to-article your-article.pdf
```

### Step 3: Done!
The script will:
1. Extract text from PDF
2. Ask you for metadata (title, source, tags, etc.)
3. Convert to markdown
4. Create article file automatically

**That's it!** 🎊

---

## 📋 Complete Workflow

### 1. **Prepare Your PDF**
- Save your article PDF to: `content/pdfs/`
- Example: `content/pdfs/bhagavad-gita-wisdom.pdf`

### 2. **Run the Converter**
```bash
npm run pdf-to-article bhagavad-gita-wisdom.pdf
```

### 3. **Answer the Prompts**
```
Article Title: The Timeless Wisdom of the Bhagavad Gita
Source Text: Bhagavad Gita
Estimated Read Time: 7 min
Brief Excerpt: Exploring Krishna's teachings on duty and purpose in modern life
Tags: Bhagavad Gita, Philosophy, Modern Life
```

### 4. **Review & Edit**
The script creates: `content/articles/bhagavad-gita-wisdom.md`

Open and refine:
- Add proper section headers (`## Title`)
- Format quotes (`> Quote`)
- Bold key terms (`**dharma**`)
- Fix any formatting issues

### 5. **Preview**
```bash
npm run dev
# Visit http://localhost:3000/articles/bhagavad-gita-wisdom
```

### 6. **Publish**
```bash
git add content/articles/bhagavad-gita-wisdom.md
git commit -m "Add: Bhagavad Gita Wisdom article"
git push
```

**Live in 2 minutes!** 🚀

---

## 🎯 What the Script Does

### ✅ Automatic Features
- **Extracts all text** from PDF
- **Cleans formatting** (removes artifacts)
- **Basic markdown conversion**:
  - Detects headers (UPPERCASE TEXT)
  - Formats quotes (lines with "")
  - Converts bullet points (• → -)
  - Adds paragraph breaks
- **Generates slug** from filename
- **Creates metadata** from your input
- **Saves markdown file** ready to publish

### 📝 You Still Need To:
- Review the generated markdown
- Add proper section structure
- Format quotes and citations
- Bold/italicize as needed
- Add reflection questions

**Time:** 5-10 minutes of cleanup vs. 30+ minutes manual!

---

## 💡 Pro Tips

### Tip 1: Name PDFs Descriptively
```bash
# Good:
dharma-modern-workplace.pdf
upanishadic-consciousness.pdf

# Bad:
article1.pdf
doc.pdf
```

### Tip 2: Use AI for Cleanup
After extraction, paste the markdown into ChatGPT:
```
Please improve this markdown article:
- Add proper headers (##)
- Format quotes as blockquotes (>)
- Structure into clear sections
- Maintain all citations

[PASTE MARKDOWN HERE]
```

### Tip 3: Batch Processing
Convert multiple PDFs:
```bash
npm run pdf-to-article article1.pdf
npm run pdf-to-article article2.pdf
npm run pdf-to-article article3.pdf
```

### Tip 4: Keep PDFs Organized
```
content/pdfs/
├── published/          # Move here after conversion
│   └── article1.pdf
├── drafts/             # PDFs not ready yet
│   └── draft1.pdf
└── article-new.pdf     # Ready to convert
```

---

## 📂 Folder Structure

```
Gurukul/
├── content/
│   ├── pdfs/                    ← PUT PDFs HERE
│   │   ├── your-article.pdf
│   │   └── another-article.pdf
│   │
│   └── articles/                ← ARTICLES APPEAR HERE
│       ├── your-article.md      (auto-generated)
│       └── another-article.md   (auto-generated)
│
└── scripts/
    └── pdf-to-article.js        ← Conversion script
```

---

## 🔧 How It Works

### Technical Details:
1. **PDF Parsing**: Uses `pdf-parse` library
2. **Text Extraction**: Pulls all text content
3. **Cleaning**: Removes PDF artifacts, extra whitespace
4. **Markdown Conversion**: 
   - Pattern matching for headers
   - Quote detection
   - Bullet point formatting
5. **Interactive Metadata**: Prompts for article info
6. **File Generation**: Creates properly formatted markdown

### Limitations:
- ❌ Can't handle images (PDFs with images)
- ❌ Complex layouts may need cleanup
- ❌ Tables might not format perfectly
- ✅ Works great for text-based articles
- ✅ Preserves all content

---

## 📊 Comparison

### Before (Manual):
1. Copy text from PDF
2. Paste into editor
3. Manually add markdown
4. Format everything
5. Create frontmatter
6. Save file

**Time:** 30-45 minutes

### After (Automated):
1. Drop PDF in folder
2. Run: `npm run pdf-to-article filename.pdf`
3. Answer prompts
4. Quick review & cleanup
5. Publish

**Time:** 10-15 minutes (50-66% faster!)

---

## 🎨 Example Output

### From PDF:
```
INTRODUCTION TO DHARMA
The concept of dharma is central to understanding...
```

### Generated Markdown:
```markdown
---
title: "Understanding Dharma"
slug: "understanding-dharma"
source: "Bhagavad Gita"
readTime: "5 min"
date: "2025-10-22"
excerpt: "Exploring the concept of dharma..."
author: "Gurukul Editorial Team"
tags: ["Dharma", "Philosophy"]
---

## Introduction to Dharma

The concept of dharma is central to understanding...
```

---

## 🆘 Troubleshooting

### PDF not found?
```bash
# Check file location
ls -la content/pdfs/

# Make sure filename is correct (case-sensitive)
npm run pdf-to-article "My Article.pdf"
```

### Extraction failed?
- Some PDFs are image-based (scanned). Convert to text first.
- Try opening PDF and copy-paste text manually

### Bad formatting?
- PDFs with complex layouts need more cleanup
- Use AI to help reformat
- Review and fix manually

### Script won't run?
```bash
# Make sure it's executable
chmod +x scripts/pdf-to-article.js

# Run directly
node scripts/pdf-to-article.js your-file.pdf
```

---

## ✅ Best Practices

### Before Conversion:
- [ ] Ensure PDF is text-based (not scanned image)
- [ ] Name file descriptively
- [ ] Place in `content/pdfs/` folder

### During Conversion:
- [ ] Use clear, compelling title
- [ ] Write engaging excerpt
- [ ] Choose accurate source text
- [ ] Add relevant tags

### After Conversion:
- [ ] Review generated markdown
- [ ] Fix formatting issues
- [ ] Add proper headers
- [ ] Format quotes correctly
- [ ] Preview in browser
- [ ] Proofread content

---

## 🚀 Advanced Usage

### Custom Template
Edit `scripts/pdf-to-article.js` to customize:
- Frontmatter fields
- Text cleaning rules
- Markdown formatting patterns
- Output structure

### Batch Script
Create `convert-all.sh`:
```bash
#!/bin/bash
for pdf in content/pdfs/*.pdf; do
  npm run pdf-to-article "$(basename "$pdf")"
done
```

### Integration with AI
Pipe output to ChatGPT API for automatic formatting improvements.

---

## 📈 Workflow Comparison

| Step | Manual | Semi-Auto | Full Auto (This!) |
|------|--------|-----------|-------------------|
| PDF → Text | Copy/paste | Converter | ✅ Automated |
| Formatting | Manual | Manual | ✅ Basic auto |
| Metadata | Manual | Manual | ✅ Interactive |
| File creation | Manual | Manual | ✅ Automated |
| **Total Time** | 45 min | 30 min | **10-15 min** |

---

## 🎯 What Makes This Special

1. **One Command**: From PDF to published-ready
2. **Interactive**: Guides you through metadata
3. **Smart Formatting**: Auto-detects structure
4. **Quality Output**: Proper markdown format
5. **Fast**: 66% time savings
6. **Simple**: No complex setup

---

## 📝 Example Session

```bash
$ npm run pdf-to-article ancient-wisdom.pdf

🔍 Looking for PDF: ancient-wisdom.pdf
📖 Reading PDF...
✅ Extracted 15 pages, 12,543 characters

📝 Let's add some metadata for your article:

Article Title: Ancient Wisdom for Modern Times
Source Text: Upanishads
Estimated Read Time: 8 min
Brief Excerpt: Exploring timeless teachings that remain relevant today
Tags: Upanishads, Philosophy, Modern Life

🔄 Converting to markdown...

✅ Article created successfully!
📄 File: /content/articles/ancient-wisdom.md
🔗 URL: /articles/ancient-wisdom

📝 Next steps:
1. Review and edit the markdown file
2. Add proper section headers (##)
3. Preview: npm run dev
4. Publish: git add, commit, and push

💡 Tip: Use AI to help format for better structure!
```

---

## 🎉 You're Ready!

Now publishing is as simple as:

1. **Drop PDF** in `content/pdfs/`
2. **Run command**: `npm run pdf-to-article filename.pdf`
3. **Answer prompts**
4. **Quick cleanup** (5 minutes)
5. **Publish!**

**From PDF to live article in under 15 minutes!** 🚀

---

## 📞 Quick Reference

```bash
# Convert PDF to article
npm run pdf-to-article your-file.pdf

# Preview result
npm run dev

# Publish
git add content/articles/your-article.md
git commit -m "New article"
git push

# That's it! 🎊
```

---

**Now you can focus on content, not formatting!** ✨📚
