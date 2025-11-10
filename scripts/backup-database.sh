#!/bin/bash

# Backup Fresh Ground Eltham Database
# Usage: ./scripts/backup-database.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Backing up Fresh Ground database...${NC}"

# Database path (default or from environment)
DB_PATH="${DATABASE_PATH:-./data/database.json}"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}❌ Database file not found: $DB_PATH${NC}"
    exit 1
fi

# Create backups directory if it doesn't exist
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup filename
BACKUP_FILE="$BACKUP_DIR/database_backup_$TIMESTAMP.json"

# Copy database to backup
cp "$DB_PATH" "$BACKUP_FILE"

# Compress the backup (optional, saves space)
if command -v gzip &> /dev/null; then
    gzip "$BACKUP_FILE"
    BACKUP_FILE="$BACKUP_FILE.gz"
    echo -e "${GREEN}✅ Database backed up and compressed to: $BACKUP_FILE${NC}"
else
    echo -e "${GREEN}✅ Database backed up to: $BACKUP_FILE${NC}"
fi

# Show file size
FILE_SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
echo -e "${BLUE}📦 Backup size: $FILE_SIZE${NC}"

# Count number of backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/database_backup_*.json* 2>/dev/null | wc -l)
echo -e "${BLUE}📁 Total backups: $BACKUP_COUNT${NC}"

# Optional: Clean up old backups (keep last 10)
KEEP_COUNT=10
if [ "$BACKUP_COUNT" -gt "$KEEP_COUNT" ]; then
    echo -e "${BLUE}🧹 Cleaning up old backups (keeping last $KEEP_COUNT)...${NC}"
    ls -1t "$BACKUP_DIR"/database_backup_*.json* | tail -n +$((KEEP_COUNT + 1)) | xargs rm -f
    echo -e "${GREEN}✅ Cleanup complete${NC}"
fi

echo -e "${GREEN}✨ Backup complete!${NC}"

