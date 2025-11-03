import https from 'https';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDir = join(__dirname, 'static', 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Unsplash image URLs - using direct source URLs
const images = {
  'coffee-beans-background.jpg': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80&fit=crop',
  'coffee-shop-interior.jpg': 'https://images.unsplash.com/photo-1501339847302-ac426a4c7c8e?w=1920&q=80&fit=crop',
  'coffee-latte-art.jpg': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&q=80&fit=crop',
  'coffee-making.jpg': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920&q=80&fit=crop',
  'coffee-cup-hero.jpg': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1920&q=80&fit=crop',
  'pastries.jpg': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1920&q=80&fit=crop',
  'coffee-bar.jpg': 'https://images.unsplash.com/photo-1509042239860-f550c710c120?w=1920&q=80&fit=crop'
};

function downloadImage(urlString, filename) {
  return new Promise((resolve, reject) => {
    const filepath = join(imagesDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`✓ ${filename} already exists, skipping...`);
      return resolve();
    }

    console.log(`Downloading ${filename}...`);
    const file = fs.createWriteStream(filepath);
    
    const url = new URL(urlString);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const request = protocol.get(urlString, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        const redirectUrl = response.headers.location || response.headers.Location;
        if (redirectUrl) {
          console.log(`  Following redirect...`);
          return downloadImage(redirectUrl.startsWith('http') ? redirectUrl : `${url.protocol}//${url.host}${redirectUrl}`, filename)
            .then(resolve)
            .catch(reject);
        }
        return reject(new Error(`Redirect but no location header`));
      }
      
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(filepath);
          console.log(`✓ Downloaded ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
          resolve();
        });
        file.on('error', (err) => {
          file.close();
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
          }
          reject(err);
        });
      } else {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

console.log('Downloading coffee images from Unsplash...\n');

const downloads = Object.entries(images).map(([filename, url]) => 
  downloadImage(url, filename).catch(err => {
    console.error(`✗ Failed to download ${filename}: ${err.message}`);
  })
);

Promise.all(downloads).then(() => {
  console.log('\nDownload complete!');
  console.log('\nFiles in static/images/:');
  const files = fs.readdirSync(imagesDir);
  files.forEach(file => {
    const stats = fs.statSync(join(imagesDir, file));
    console.log(`  ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
});

