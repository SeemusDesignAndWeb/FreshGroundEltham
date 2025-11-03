# Download Images

To download the coffee-themed background images from Unsplash, run:

```bash
npm run download-images
```

Or directly:

```bash
node download-images.mjs
```

## What gets downloaded:

- `coffee-beans-background.jpg` - Background for menu section
- `coffee-shop-interior.jpg` - Background for events section  
- `coffee-latte-art.jpg` - Gallery image
- `coffee-making.jpg` - Gallery image
- `coffee-cup-hero.jpg` - Hero section background
- `pastries.jpg` - Gallery image
- `coffee-bar.jpg` - Gallery image

## Manual Download Alternative

If the script doesn't work, you can manually download images:

1. Visit https://unsplash.com/s/photos/coffee
2. Download coffee-related images
3. Save them to `static/images/` with the filenames listed above

The website will gracefully handle missing images by showing fallback placeholders.

