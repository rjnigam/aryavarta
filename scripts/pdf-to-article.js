#!/usr/bin/env node

/**
 * PDF to Markdown Article Converter
 * Usage: node scripts/pdf-to-article.js <pdf-filename>
 * 
 * Place your PDF in content/pdfs/ folder, then run this script.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pdfsDirectory = path.join(process.cwd(), 'content/pdfs');
const articlesDirectory = path.join(process.cwd(), 'content/articles');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * Clean and format extracted text
 */
function cleanText(text) {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Add proper line breaks
    .replace(/\. ([A-Z])/g, '.\n\n$1')
    // Clean up common PDF artifacts
    .replace(/\f/g, '')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();
}

/**
 * Convert text to basic markdown structure
 */
function textToMarkdown(text) {
  let markdown = text;

  // Try to detect and format headers (UPPERCASE SENTENCES)
  markdown = markdown.replace(/^([A-Z][A-Z\s]{10,})$/gm, (match) => {
    return `\n\n## ${match.trim()}\n\n`;
  });

  // Try to detect and format quotes (lines starting with quotes)
  markdown = markdown.replace(/^[""](.+?)[""]$/gm, (match, quote) => {
    return `\n> ${quote.trim()}\n`;
  });

  // Format bullet points
  markdown = markdown.replace(/^[•·∙‣⁃]\s*(.+)$/gm, '- $1');

  // Add paragraph breaks
  markdown = markdown.replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2');

  return markdown;
}

/**
 * Generate slug from filename
 */
function generateSlug(filename) {
  return filename
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Main conversion function
 */
async function convertPdfToArticle(pdfFilename) {
  try {
    console.log('🔍 Looking for PDF:', pdfFilename);
    
    const pdfPath = path.join(pdfsDirectory, pdfFilename);
    
    if (!fs.existsSync(pdfPath)) {
      console.error(`❌ PDF not found: ${pdfPath}`);
      console.log(`\nMake sure your PDF is in: content/pdfs/`);
      return;
    }

    console.log('📖 Reading PDF...');
    
    // Import pdf-parse v2 - use PDFParse class
    const { PDFParse } = require('pdf-parse');
    const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
    const result = await parser.getText();
    const data = { 
      numpages: result.pages.length,
      text: result.text
    };

    console.log(`✅ Extracted ${data.numpages} pages, ${data.text.length} characters\n`);

    // Get metadata from user
    console.log('📝 Let\'s add some metadata for your article:\n');
    
    const title = await question('Article Title: ');
    const source = await question('Source Text (e.g., "Bhagavad Gita", "Upanishads"): ');
    const readTime = await question('Estimated Read Time (e.g., "5 min"): ');
    const excerpt = await question('Brief Excerpt (1-2 sentences): ');
    const tags = await question('Tags (comma-separated, e.g., "Philosophy, Modern Life"): ');
    
    const slug = generateSlug(pdfFilename);
    const today = new Date().toISOString().split('T')[0];

    // Clean and convert text
    console.log('\n🔄 Converting to markdown...');
    const cleanedText = cleanText(data.text);
    const markdownContent = textToMarkdown(cleanedText);

    // Create frontmatter
    const frontmatter = `---
title: "${title}"
slug: "${slug}"
source: "${source}"
readTime: "${readTime}"
date: "${today}"
excerpt: "${excerpt}"
author: "Aryavarta Editorial Team"
tags: [${tags.split(',').map(t => `"${t.trim()}"`).join(', ')}]
---

`;

    const fullContent = frontmatter + markdownContent;

    // Ensure articles directory exists
    if (!fs.existsSync(articlesDirectory)) {
      fs.mkdirSync(articlesDirectory, { recursive: true });
    }

    // Save to file
    const outputPath = path.join(articlesDirectory, `${slug}.md`);
    
    if (fs.existsSync(outputPath)) {
      const overwrite = await question(`\n⚠️  Article already exists at ${slug}.md. Overwrite? (y/n): `);
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Cancelled.');
        rl.close();
        return;
      }
    }

    fs.writeFileSync(outputPath, fullContent, 'utf8');

    console.log('\n✅ Article created successfully!');
    console.log('📄 File:', outputPath);
    console.log('🔗 URL: /articles/' + slug);
    console.log('\n📝 Next steps:');
    console.log('1. Review and edit the markdown file (formatting may need cleanup)');
    console.log('2. Add proper section headers (##), quotes (>), and formatting');
    console.log('3. Preview: npm run dev');
    console.log('4. Publish: git add, commit, and push');
    console.log('\n💡 Tip: Use AI (ChatGPT) to help format the markdown for better structure!');

    rl.close();

  } catch (error) {
    console.error('❌ Error converting PDF:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Please provide a PDF filename');
  console.log('\nUsage: node scripts/pdf-to-article.js <filename.pdf>');
  console.log('\nExample: node scripts/pdf-to-article.js "my-article.pdf"');
  console.log('\nMake sure your PDF is in: content/pdfs/');
  process.exit(1);
}

const pdfFilename = args[0];
convertPdfToArticle(pdfFilename);
