#!/bin/bash

cd "$(dirname "$0")"

echo "Downloading coffee images from Unsplash..."
echo ""

# Coffee beans background
echo "Downloading coffee-beans-background.jpg..."
curl -L "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80&fit=crop" -o static/images/coffee-beans-background.jpg && echo "✓ Downloaded coffee-beans-background.jpg" || echo "✗ Failed"

# Coffee shop interior
echo "Downloading coffee-shop-interior.jpg..."
curl -L "https://images.unsplash.com/photo-1501339847302-ac426a4c7c8e?w=1920&q=80&fit=crop" -o static/images/coffee-shop-interior.jpg && echo "✓ Downloaded coffee-shop-interior.jpg" || echo "✗ Failed"

# Coffee latte art
echo "Downloading coffee-latte-art.jpg..."
curl -L "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&q=80&fit=crop" -o static/images/coffee-latte-art.jpg && echo "✓ Downloaded coffee-latte-art.jpg" || echo "✗ Failed"

# Coffee making
echo "Downloading coffee-making.jpg..."
curl -L "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920&q=80&fit=crop" -o static/images/coffee-making.jpg && echo "✓ Downloaded coffee-making.jpg" || echo "✗ Failed"

# Coffee cup hero
echo "Downloading coffee-cup-hero.jpg..."
curl -L "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1920&q=80&fit=crop" -o static/images/coffee-cup-hero.jpg && echo "✓ Downloaded coffee-cup-hero.jpg" || echo "✗ Failed"

# Pastries
echo "Downloading pastries.jpg..."
curl -L "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1920&q=80&fit=crop" -o static/images/pastries.jpg && echo "✓ Downloaded pastries.jpg" || echo "✗ Failed"

# Coffee bar
echo "Downloading coffee-bar.jpg..."
curl -L "https://images.unsplash.com/photo-1509042239860-f550c710c120?w=1920&q=80&fit=crop" -o static/images/coffee-bar.jpg && echo "✓ Downloaded coffee-bar.jpg" || echo "✗ Failed"

echo ""
echo "Download complete!"
echo ""
echo "Files in static/images/:"
ls -lh static/images/ | tail -n +2 | awk '{print "  " $9 " (" $5 ")"}'
