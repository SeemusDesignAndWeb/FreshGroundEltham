#!/bin/bash

cd "$(dirname "$0")"

echo "Downloading coffee images from Unsplash..."

# Coffee beans background
curl -L "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&q=80" -o static/images/coffee-beans-background.jpg

# Coffee shop interior
curl -L "https://images.unsplash.com/photo-1501339847302-ac426a4c7c8e?w=1920&q=80" -o static/images/coffee-shop-interior.jpg

# Coffee latte art
curl -L "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1920&q=80" -o static/images/coffee-latte-art.jpg

# Coffee making
curl -L "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920&q=80" -o static/images/coffee-making.jpg

# Coffee cup hero
curl -L "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1920&q=80" -o static/images/coffee-cup-hero.jpg

# Pastries/bakery
curl -L "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1920&q=80" -o static/images/pastries.jpg

echo "Download complete!"
ls -lh static/images/

