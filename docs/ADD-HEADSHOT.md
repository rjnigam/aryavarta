# Adding Your Professional Headshot

## Step-by-Step Instructions

### 1. Save the Image
- Right-click on your professional headshot image (the one you just shared)
- Select "Save Image As..."
- Save it to your Downloads folder as `rajath-nigam.jpg`

### 2. Move to Correct Location
Open Terminal and run:

```bash
# Move the image from Downloads to the correct location
mv ~/Downloads/rajath-nigam.jpg /Users/rajathnigam/Gurukul/public/authors/rajath-nigam.jpg
```

Or using Finder:
- Navigate to: `/Users/rajathnigam/Gurukul/public/authors/`
- Drag and drop `rajath-nigam.jpg` into this folder
- Replace the existing placeholder file when prompted

### 3. Verify the Image
Run this command to check if the image is properly placed:

```bash
cd /Users/rajathnigam/Gurukul
node scripts/check-author-image.js
```

### 4. Deploy
Once verified, deploy to production:

```bash
npm run build
vercel --prod
```

## Image Specifications

✅ **Your current image looks perfect!**
- Professional headshot ✓
- Neutral gray background ✓
- Good lighting ✓
- Face clearly visible ✓

**Recommended specs:**
- Format: JPEG (`.jpg`)
- Dimensions: 400x400px minimum (square)
- File size: Under 200KB
- Your image should work perfectly as-is!

## Troubleshooting

If the image doesn't appear:
1. Make sure the filename is exactly: `rajath-nigam.jpg` (lowercase, no spaces)
2. Check it's in: `/Users/rajathnigam/Gurukul/public/authors/`
3. Clear Next.js cache: `rm -rf .next`
4. Rebuild: `npm run build`
