#!/bin/bash

# Restore Fresh Ground Eltham Database
# Usage: ./scripts/restore-database.sh [backup_file]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Fresh Ground Database Restore${NC}"
echo

# Database path (default or from environment)
DB_PATH="${DATABASE_PATH:-./data/database.json}"

# Backups directory
BACKUP_DIR="./backups"

# If no backup file specified, show available backups
if [ -z "$1" ]; then
    echo -e "${YELLOW}Available backups:${NC}"
    echo
    
    # Check if any backups exist
    if ! ls -1 "$BACKUP_DIR"/database_backup_*.json* 2>/dev/null | head -n 1 >/dev/null; then
        echo -e "${RED}❌ No backups found in $BACKUP_DIR${NC}"
        echo -e "${BLUE}💡 Run ./scripts/backup-database.sh to create a backup first${NC}"
        exit 1
    fi
    
    # List backups with index
    index=1
    ls -1t "$BACKUP_DIR"/database_backup_*.json* | while read -r file; do
        FILE_SIZE=$(ls -lh "$file" | awk '{print $5}')
        FILE_DATE=$(ls -l "$file" | awk '{print $6, $7, $8}')
        echo -e "${BLUE}[$index]${NC} $file"
        echo "    Size: $FILE_SIZE | Date: $FILE_DATE"
        echo
        index=$((index + 1))
    done
    
    echo -e "${YELLOW}Usage: ./scripts/restore-database.sh <backup_file>${NC}"
    echo -e "${YELLOW}Example: ./scripts/restore-database.sh ./backups/database_backup_20250110_120000.json.gz${NC}"
    exit 0
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}Backup file: $BACKUP_FILE${NC}"
echo -e "${BLUE}Restore to: $DB_PATH${NC}"
echo

# Confirm restore
echo -e "${YELLOW}⚠️  WARNING: This will overwrite your current database!${NC}"
echo -e "${YELLOW}Make sure you have a backup of the current database if needed.${NC}"
echo
read -p "Are you sure you want to continue? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo -e "${RED}❌ Restore cancelled${NC}"
    exit 1
fi

# Backup current database before restoring (just in case)
if [ -f "$DB_PATH" ]; then
    SAFETY_BACKUP="./backups/database_before_restore_$(date +"%Y%m%d_%H%M%S").json"
    echo -e "${BLUE}📦 Creating safety backup of current database...${NC}"
    cp "$DB_PATH" "$SAFETY_BACKUP"
    echo -e "${GREEN}✅ Safety backup created: $SAFETY_BACKUP${NC}"
    echo
fi

# Check if file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo -e "${BLUE}📂 Decompressing backup...${NC}"
    gunzip -c "$BACKUP_FILE" > "$DB_PATH"
else
    echo -e "${BLUE}📂 Copying backup...${NC}"
    cp "$BACKUP_FILE" "$DB_PATH"
fi

echo -e "${GREEN}✅ Database restored successfully!${NC}"
echo
echo -e "${BLUE}🔄 Please restart your application for changes to take effect${NC}"

