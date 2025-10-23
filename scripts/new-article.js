#!/usr/bin/env node

/**
 * Simple script to create a new article template
 * Usage: node scripts/new-article.js "Article Title"
 */

const fs = require('fs');
const path = require('path');

// Get article title from command line
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Please provide an article title');
  console.log('Usage: node scripts/new-article.js "Your Article Title"');
  process.exit(1);
}

const title = args.join(' ');

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Article template
const template = `---
title: "${title}"
slug: "${slug}"
source: "Bhagavad Gita"
readTime: "5 min"
date: "${today}"
excerpt: "Brief description that appears in previews. Update this with your actual excerpt."
author: "Rajath Nigam"
tags: ["Tag1", "Tag2", "Tag3"]
---

## Opening Hook

Start with a relatable modern problem or question that draws the reader in...

## The Ancient Context

Introduce the scripture and provide historical/philosophical background...

## Core Teaching

Deep dive into the main concept or teaching from the ancient text...

### Practical Application 1

How to apply this wisdom in modern daily life...

### Practical Application 2

Another contemporary example or application...

## Key Insights

- Insight or takeaway #1
- Insight or takeaway #2
- Insight or takeaway #3

## Reflection Questions

- Question that prompts self-inquiry
- Another thoughtful question
- One more for deeper contemplation

---

*Closing thought that ties everything together and leaves the reader inspired.*
`;

// Ensure content/articles directory exists
const articlesDir = path.join(process.cwd(), 'content', 'articles');
if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

// Create the file
const filePath = path.join(articlesDir, `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`❌ Article already exists: ${filePath}`);
  process.exit(1);
}

fs.writeFileSync(filePath, template, 'utf8');

console.log('✅ New article created!');
console.log('📄 File:', filePath);
console.log('🔗 URL: /articles/' + slug);
console.log('\n📝 Next steps:');
console.log('1. Open the file and update the frontmatter');
console.log('2. Write your article content');
console.log('3. Preview: npm run dev');
console.log('4. Publish: git add, commit, and push');
