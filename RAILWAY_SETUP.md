# Railway.app Database Persistence Setup

## Problem

Railway overwrites `database.json` during each deployment because:
1. Railway builds from a fresh git clone
2. The filesystem is ephemeral by default (resets on each deploy)
3. Any changes made on Railway (bookings, etc.) get lost

## Solution: Use Railway Persistent Storage

### Option 1: Railway Volumes (Recommended)

1. **Create a Volume in Railway:**
   - Go to your Railway project
   - Click "New" → "Volume"
   - Name it: `database-storage`
   - Mount path: `/data`

2. **Update Environment Variables:**
   - In Railway, go to your service → Variables
   - Add: `DATABASE_PATH=/data/database.json`
   - Add: `SPECIAL_OFFERS_DB_PATH=/data/specialOffers.json`

3. **Update Build/Start Commands:**
   - The volume will persist between deployments
   - Database files will be stored in `/data` which persists

### Option 2: Use Railway's Persistent Storage Path

Railway provides a persistent directory at `/tmp` or you can use `/app/data` if you configure it.

1. **Set Environment Variables:**
   ```
   DATABASE_PATH=/tmp/database.json
   SPECIAL_OFFERS_DB_PATH=/tmp/specialOffers.json
   ```

2. **Note:** `/tmp` may not persist across all Railway instances, so Option 1 (Volumes) is better.

### Option 3: Initialize Database on First Run

Add a startup script that checks if the database exists, and if not, copies from git:

```javascript
// In your startup script or server initialization
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = process.env.DATABASE_PATH || './data/database.json';
const GIT_DB_PATH = './data/database.json';

if (!existsSync(DB_PATH) && existsSync(GIT_DB_PATH)) {
  // Copy from git version on first run
  copyFileSync(GIT_DB_PATH, DB_PATH);
}
```

## Recommended Setup

**Best Practice:** Use Railway Volumes + Environment Variables

1. Create volume: `/data`
2. Set environment variables:
   - `DATABASE_PATH=/data/database.json`
   - `SPECIAL_OFFERS_DB_PATH=/data/specialOffers.json`

This way:
- ✅ Database persists between deployments
- ✅ Changes made via admin panel are saved
- ✅ Bookings are preserved
- ✅ Git version is used as initial template (if needed)

## Migration Steps

1. **Before setting up volumes:**
   - Export your current Railway database (if you have important data)
   - Or commit the current state to git

2. **Set up the volume:**
   - Create volume in Railway
   - Set environment variables
   - Redeploy

3. **Initialize (if needed):**
   - On first deploy, the database will be created from git
   - Or manually copy from git version if needed

## Important Notes

- **Bookings** should NOT be in git (privacy)
- **Static content** (menu, activities, testimonials) CAN be in git
- **Production changes** made via admin will persist with volumes
- **Development changes** should be committed to git and pushed

## Alternative: Separate Dev/Prod Databases

If you want completely separate databases:

1. Add `data/database.json` to `.gitignore`
2. Use environment variables:
   - Dev: `DATABASE_PATH=./data/database.dev.json`
   - Prod: `DATABASE_PATH=/data/database.prod.json` (with volume)
3. Manually sync content between dev/prod when needed

