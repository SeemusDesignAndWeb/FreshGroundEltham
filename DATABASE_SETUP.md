# Database Setup & Management

## Overview

Fresh Ground Eltham uses a JSON file database (`data/database.json`) that stores all CMS content including menu items, activities, testimonials, settings, and more.

**Important**: The database is **NOT tracked in git** to prevent data loss when deploying code updates.

## Quick Start

### For New Installations

The database will be created automatically with default values when you first run the application. No setup required!

### For Existing Installations

If you're migrating from the old system where the database was tracked in git, your data is safe. Just pull the latest code - your existing `data/database.json` will not be affected.

## Database Backup

### Create a Backup

```bash
npm run backup
# or
./scripts/backup-database.sh
```

This creates a timestamped, compressed backup in the `backups/` directory and automatically keeps the last 10 backups.

### Restore from Backup

```bash
npm run restore
# or
./scripts/restore-database.sh
```

This shows available backups and lets you choose which one to restore. A safety backup is created before restoring.

## Production Setup

### Initial Deployment

1. Deploy your code to the production server
2. The database will be created automatically on first run
3. Configure your site through the admin panel
4. Create your first backup:
   ```bash
   npm run backup
   ```

### Regular Backups (Recommended)

Set up daily automated backups using cron:

```bash
# Edit crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * cd /path/to/FreshGroundEltham && ./scripts/backup-database.sh >> /var/log/freshground-backup.log 2>&1
```

## Syncing Data Between Environments

### Copy Production Data to Local Development

```bash
# 1. On production server, create backup
npm run backup

# 2. Download the backup to your local machine
scp user@your-server:/path/to/FreshGroundEltham/backups/database_backup_*.json.gz ~/Downloads/

# 3. On your local machine, restore the backup
npm run restore ~/Downloads/database_backup_TIMESTAMP.json.gz
```

### Copy Local Data to Production (Careful!)

```bash
# 1. On local machine, create backup
npm run backup

# 2. Upload to production server
scp ./backups/database_backup_*.json.gz user@your-server:/path/to/FreshGroundEltham/backups/

# 3. SSH into production and restore
ssh user@your-server
cd /path/to/FreshGroundEltham
npm run restore ./backups/database_backup_TIMESTAMP.json.gz

# 4. Restart your application
pm2 restart all
```

## Database Location

### Default Location

```
./data/database.json
```

### Custom Location (Optional)

You can use a custom database location by setting the `DATABASE_PATH` environment variable:

```bash
# In your .env file
DATABASE_PATH=./data/database.prod.json

# Or when running commands
DATABASE_PATH=./data/custom.json npm run dev
```

This is useful for:
- Running multiple environments on the same machine
- Storing the database on a different disk/volume
- Testing with a separate database

## Database Structure

The database contains:

- **activities**: Kids activity bookings
- **bookings**: Completed bookings  
- **testimonials**: Customer testimonials
- **menuItems**: Café menu items
- **openingTimes**: Opening hours and settings
- **activitiesSettings**: Activities page settings
- **bannerSettings**: Top banner configuration
- **images**: Image library
- **navigationSettings**: Navigation menu items
- **pageBackgrounds**: Page background images
- **heroSliderSettings**: Homepage slider images
- **gallerySettings**: Gallery images

## Troubleshooting

### Database Not Found Error

**Cause**: The database file doesn't exist yet.

**Solution**: The application will create it automatically on first run. Or manually create an empty database:

```bash
mkdir -p data
echo '{"activities":[],"bookings":[],"testimonials":[],"menuItems":[],"openingTimes":null}' > data/database.json
```

### Permission Errors

**Cause**: The application doesn't have write access to the `data/` directory.

**Solution**:
```bash
# Make sure the data directory is writable
chmod 755 data
chmod 644 data/database.json
```

### Data Lost After Git Pull

**Cause**: The database was accidentally committed to git and overwrote your local data.

**Solution**:
1. Restore from your most recent backup:
   ```bash
   npm run restore
   ```

2. Ensure database is in `.gitignore`:
   ```bash
   grep "database.json" .gitignore
   # Should show: /data/database.json
   ```

3. Remove database from git if it's tracked:
   ```bash
   git rm --cached data/database.json
   git commit -m "Stop tracking database"
   ```

### Backup Files Taking Too Much Space

**Solution**: The backup script automatically keeps only the last 10 backups. To manually clean up:

```bash
# Keep only the last 5 backups
ls -1t backups/database_backup_*.json* | tail -n +6 | xargs rm -f
```

### Need to Reset Everything

**Solution**: Delete the database to start fresh:

```bash
# Backup first (optional)
npm run backup

# Delete database
rm data/database.json

# Restart application - it will create a new empty database
npm run dev
```

## Best Practices

1. **Backup Before Major Changes**
   - Before bulk menu imports
   - Before deleting many items
   - Before testing experimental features

2. **Backup Before Deployments**
   ```bash
   # On production server, before pulling code
   npm run backup
   git pull origin main
   npm run build
   pm2 restart all
   ```

3. **Test Backups Regularly**
   - Occasionally restore a backup to a test environment
   - Verify the restore process works
   - Ensure backups are not corrupted

4. **Store Backups Offsite**
   - Periodically download production backups
   - Store in a secure location (cloud storage, external drive)
   - Don't rely only on server backups

5. **Monitor Backup Logs**
   ```bash
   # Check if automated backups are running
   tail -f /var/log/freshground-backup.log
   ```

## Security Notes

- The database may contain customer email addresses and booking information
- Keep backups secure and private
- Use appropriate file permissions (644 for database, 600 for backups)
- Don't commit the database or backups to public repositories
- Consider encrypting offsite backup storage

## Support

For issues or questions:
1. Check the [DEPLOYMENT_WORKFLOW.md](./DEPLOYMENT_WORKFLOW.md) guide
2. Review the backup script logs
3. Restore from a known good backup if needed

