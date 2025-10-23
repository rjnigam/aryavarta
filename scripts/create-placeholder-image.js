const fs = require('fs');
const path = require('path');

// Create a simple SVG placeholder
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#d97706"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="140" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">RN</text>
</svg>`;

const outputPath = path.join(__dirname, '..', 'public', 'authors', 'rajath-nigam.svg');
fs.writeFileSync(outputPath, svg, 'utf8');
console.log('✅ Created placeholder SVG:', outputPath);
console.log('📝 To add your actual photo:');
console.log('   1. Save your headshot as: public/authors/rajath-nigam.jpg');
console.log('   2. The component will automatically use the .jpg file');
