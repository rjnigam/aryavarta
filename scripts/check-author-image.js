#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, '..', 'public', 'authors', 'rajath-nigam.jpg');

if (!fs.existsSync(imagePath)) {
  console.log('❌ Author image not found!');
  console.log('📁 Expected location:', imagePath);
  console.log('');
  console.log('Please save your headshot image to this location.');
  process.exit(1);
}

const stats = fs.statSync(imagePath);
const fileSizeInKB = (stats.size / 1024).toFixed(2);

console.log('✅ Author image found!');
console.log('📁 Location:', imagePath);
console.log('📊 File size:', fileSizeInKB, 'KB');

if (stats.size > 200 * 1024) {
  console.log('⚠️  Warning: Image is larger than 200KB. Consider optimizing for better performance.');
} else {
  console.log('✨ File size is optimal!');
}

console.log('');
console.log('🚀 Ready to deploy! Run: npm run build && vercel --prod');
