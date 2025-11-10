# Deployment Workflow

## Overview

This project now uses **separate databases for development and production** to prevent data loss when deploying code updates. The database file (`data/database.json`) is **NOT tracked in git**.

## Database Management

### Database Locations

- **Local Development**: `data/database.json` (default)
- **Production**: `data/database.json` (on production server)
- **Backups**: `backups/` directory (gitignored)

### Important: Database is NOT in Git

The database is excluded from version control to prevent:
- ❌ Overwriting production data with dev data
- ❌ Overwriting dev data with old data from git
- ❌ Losing data when pulling code updates

## Making Changes

### Local Development

1. **Make changes via Admin Panel**
   - Add/edit menu items via Admin > Menu
   - Add/edit activities via Admin > Activities  
   - Upload images via Admin > Images
   - Update settings via Admin

2. **Commit code changes only**
   ```bash
   git add .
   git commit -m "Update feature X"
   git push
   ```
   
   ⚠️ **Note**: `data/database.json` is automatically excluded from commits

### Production Deployment

When deploying code to production:

1. **Backup production database first**
   ```bash
   # On production server
   ./scripts/backup-database.sh
   ```

2. **Pull code updates**
   ```bash
   git pull origin main
   ```

3. **Restart application**
   ```bash
   npm run build
   pm2 restart all  # or your process manager
   ```

4. **Your data is safe!** The database file is not affected by git pull

## Database Backup & Restore

### Create a Backup

```bash
./scripts/backup-database.sh
```

This will:
- Create a timestamped backup in `backups/`
- Compress it to save space
- Keep the last 10 backups automatically
- Show backup size and location

### Restore from Backup

```bash
# List available backups
./scripts/restore-database.sh

# Restore a specific backup
./scripts/restore-database.sh ./backups/database_backup_20250110_120000.json.gz
```

The restore script will:
- Show available backups with dates
- Create a safety backup before restoring
- Confirm before overwriting current database

### Recommended Backup Schedule

- **Development**: Backup before major changes
- **Production**: 
  - Daily automated backups (set up cron job)
  - Manual backup before deployments
  - Manual backup before bulk data changes

### Setting Up Automated Backups (Production)

Add to your crontab:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/FreshGroundEltham && ./scripts/backup-database.sh >> /var/log/freshground-backup.log 2>&1
```

## Syncing Data Between Environments

### Option 1: Manual Transfer (Recommended)

To copy data from production to development:

```bash
# On production server
./scripts/backup-database.sh

# Copy backup file to local machine
scp user@server:/path/to/backups/database_backup_*.json.gz ~/Downloads/

# On local machine
./scripts/restore-database.sh ~/Downloads/database_backup_*.json.gz
```

### Option 2: Using Environment Variables

You can use different database files for dev/prod on the same machine:

```bash
# Development
DATABASE_PATH=./data/database.dev.json npm run dev

# Production
DATABASE_PATH=./data/database.prod.json npm run start
```

Add to your `.env` file:
```env
# Optional: Use a different database path
# DATABASE_PATH=./data/database.json  # default
```

## What Gets Deployed vs What Doesn't

### ✅ Tracked in Git (Deployed)
- Application code
- Static images (in `static/images/`)
- Configuration files
- Dependencies

### ❌ NOT Tracked in Git (Not Deployed)
- **Database** (`data/database.json`)
- **Backups** (`backups/*.json`)
- **Uploaded images** (using Cloudinary now)
- **Environment variables** (`.env`)
- **Build output** (`build/`)

## Deployment Checklist

Before deploying to production:

- [ ] Backup production database
- [ ] Test changes locally
- [ ] Commit and push code
- [ ] Pull changes on production
- [ ] Rebuild application
- [ ] Restart server
- [ ] Verify site is working
- [ ] Check that admin panel works
- [ ] Verify database was not affected

## Troubleshooting

### "Database is empty after deployment"

**Cause**: You may have accidentally committed and pushed `data/database.json`, and it overwrote your production data.

**Solution**:
1. Restore from your backup:
   ```bash
   ./scripts/restore-database.sh
   ```
2. Ensure `.gitignore` excludes the database:
   ```
   /data/database.json
   ```

### "Can't pull because database has conflicts"

**Cause**: The database was tracked in git previously.

**Solution**:
```bash
# Remove database from git tracking
git rm --cached data/database.json
git commit -m "Stop tracking database"
git push
```

### "Need to copy production data to development"

**Solution**: Use the backup/restore scripts as shown above in "Syncing Data Between Environments"

## Migration from Old System

If you previously had the database tracked in git:

1. **Backup your current data**:
   ```bash
   ./scripts/backup-database.sh
   ```

2. **Remove from git** (already done):
   ```bash
   git rm --cached data/database.json
   ```

3. **Commit the change**:
   ```bash
   git add .gitignore
   git commit -m "Stop tracking database in git"
   git push
   ```

4. **On production server**:
   - Your existing `data/database.json` will remain untouched
   - Pull the new code (git will now ignore the database)
   - Continue working normally

Your data is now safe from being overwritten! 🎉

