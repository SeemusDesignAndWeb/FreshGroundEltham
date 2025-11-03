#!/usr/bin/env python3
import urllib.request
import os

# Create images directory if it doesn't exist
os.makedirs('static/images', exist_ok=True)

# Unsplash image URLs (using Unsplash Source API)
images = {
    'coffee-beans-background.jpg': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80',
    'coffee-shop-interior.jpg': 'https://images.unsplash.com/photo-1501339847302-ac426a4c7c8e?w=1920&q=80',
    'coffee-latte-art.jpg': 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&q=80',
    'coffee-making.jpg': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920&q=80',
    'coffee-cup-hero.jpg': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1920&q=80',
    'pastries.jpg': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1920&q=80',
    'coffee-bar.jpg': 'https://images.unsplash.com/photo-1509042239860-f550c710c120?w=1920&q=80'
}

print("Downloading coffee images from Unsplash...")

for filename, url in images.items():
    filepath = f'static/images/{filename}'
    if os.path.exists(filepath):
        print(f"✓ {filename} already exists, skipping...")
        continue
    try:
        print(f"Downloading {filename}...")
        urllib.request.urlretrieve(url, filepath)
        print(f"✓ Downloaded {filename}")
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")

print("\nDownload complete!")
print("\nFiles in static/images/:")
for f in sorted(os.listdir('static/images')):
    size = os.path.getsize(f'static/images/{f}')
    print(f"  {f} ({size:,} bytes)")

