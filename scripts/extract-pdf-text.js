#!/usr/bin/env node

const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function extractText() {
  try {
    const pdfPath = process.argv[2];
    if (!pdfPath) {
      console.error('Usage: node extract-pdf-text.js <pdf-filename>');
      process.exit(1);
    }
    
    const fullPath = `content/pdfs/${pdfPath}`;
    const parser = new PDFParse({ data: fs.readFileSync(fullPath) });
    const result = await parser.getText();
    
    console.log('=== FULL TEXT ===');
    console.log(result.text);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

extractText();
