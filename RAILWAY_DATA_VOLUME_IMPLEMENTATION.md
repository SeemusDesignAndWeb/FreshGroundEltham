# Railway.app Data Volume Implementation Guide

## Overview

This guide explains how to implement persistent JSON database storage on Railway.app using data volumes. This pattern allows your application to persist data (like `database.json`) across deployments, preventing data loss when Railway rebuilds your application.

## The Problem

By default, Railway's filesystem is **ephemeral**, meaning:
- Files are reset on each deployment
- Changes made at runtime (bookings, user data, etc.) are lost
- Git-tracked files are overwritten with the repository version
- Production data cannot be stored in the application filesystem

## The Solution: Railway Volumes

Railway Volumes provide persistent storage that survives deployments. This guide shows you how to:
1. Create and mount a Railway volume
2. Configure your application to use the volume
3. Implement automatic initialization from git-tracked defaults
4. Handle both development and production environments

---

## Step-by-Step Implementation

### Step 1: Create a Railway Volume

1. **Navigate to your Railway project:**
   - Go to [railway.app](https://railway.app)
   - Select your project
   - Select your service

2. **Create a new volume:**
   - Click **"New"** → **"Volume"**
   - **Name:** `data-storage` (or any descriptive name)
   - **Mount Path:** `/data` (this is where the volume will be accessible)
   - Click **"Add"**

3. **Important Notes:**
   - The mount path must be an absolute path (starts with `/`)
   - The volume persists independently of deployments
   - Multiple services can mount the same volume (if needed)

### Step 2: Configure Environment Variables

1. **In Railway, go to your service → Variables tab**

2. **Add the following environment variables:**
   ```
   DATABASE_PATH=/data/database.json
   SPECIAL_OFFERS_DB_PATH=/data/specialOffers.json
   ```
   (Adjust variable names and paths based on your application's needs)

3. **For local development, you can use:**
   ```
   DATABASE_PATH=./data/database.json
   SPECIAL_OFFERS_DB_PATH=./data/specialOffers.json
   ```
   (Use relative paths for local dev, absolute paths for Railway)

### Step 3: Implement Database Module

Create or update your database module to handle both relative and absolute paths, with automatic initialization from git-tracked defaults.

#### Key Implementation Patterns

**1. Path Resolution Function:**
```typescript
import { join, dirname } from 'path';
import { mkdirSync } from 'fs';

function getDbPath(): string {
  const DB_PATH = process.env.DATABASE_PATH || './data/database.json';
  
  let finalPath: string;
  if (DB_PATH.startsWith('./') || DB_PATH.startsWith('../')) {
    // Relative path - resolve from project root (local development)
    finalPath = join(process.cwd(), DB_PATH);
  } else {
    // Absolute path (e.g., /data/database.json for Railway volumes)
    finalPath = DB_PATH;
  }
  
  // Ensure the directory exists
  const dir = dirname(finalPath);
  try {
    mkdirSync(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist, or volume might not be mounted yet (during build)
    // This is okay - we'll handle errors when reading/writing
    console.warn('[DB] Could not create directory:', error);
  }
  
  return finalPath;
}
```

**2. Read Function with Auto-Initialization:**
```typescript
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export function readDatabase(): Database {
  try {
    const dbPath = getDbPath();
    const data = readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('[DB] Failed to read database from persistent location:', error);
    
    // If file doesn't exist, try to initialize from git version
    // This helps on Railway when using persistent storage
    try {
      const gitDbPath = join(process.cwd(), './data/database.json');
      
      if (gitDbPath !== DB_PATH && existsSync(gitDbPath)) {
        console.log('[DB] Initializing from git version...');
        const gitData = readFileSync(gitDbPath, 'utf-8');
        const db = JSON.parse(gitData);
        
        // Copy to persistent location
        try {
          writeDatabase(db);
          console.log('[DB] Successfully initialized database');
        } catch (writeError) {
          console.warn('[DB] Could not write to persistent location:', writeError);
        }
        
        return db;
      }
    } catch (initError) {
      console.warn('[DB] Could not initialize from git database:', initError);
    }
    
    // Return default structure if initialization fails
    return {
      // Your default database structure
      activities: [],
      bookings: [],
      testimonials: [],
      menuItems: [],
      openingTimes: null
    };
  }
}
```

**3. Write Function:**
```typescript
export function writeDatabase(data: Database): void {
  const dbPath = getDbPath();
  
  // Ensure directory exists before writing
  const dir = dirname(dbPath);
  try {
    mkdirSync(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
    console.warn('[DB] Directory creation warning:', error);
  }
  
  try {
    const jsonData = JSON.stringify(data, null, 2);
    writeFileSync(dbPath, jsonData, 'utf-8');
    console.log('[DB] Successfully wrote database to', dbPath);
  } catch (error) {
    console.error('[DB] Could not write database:', error);
    throw error; // Re-throw so caller can handle it
  }
}
```

### Step 4: Update Your Application Code

Ensure all database operations use the centralized read/write functions:

```typescript
// Example: Adding a booking
export function addBooking(booking: any): void {
  const db = readDatabase();
  db.bookings.push(booking);
  writeDatabase(db);
}

// Example: Getting menu items
export function getMenuItems(): MenuItem[] {
  const db = readDatabase();
  return db.menuItems || [];
}
```

### Step 5: Handle Multiple Database Files

If you have multiple JSON files (e.g., `database.json` and `specialOffers.json`), create separate path resolution functions:

```typescript
const DB_PATH = process.env.DATABASE_PATH || './data/database.json';
const SPECIAL_OFFERS_DB_PATH = process.env.SPECIAL_OFFERS_DB_PATH || './data/specialOffers.json';

function getDbPath(): string {
  // ... implementation as above
}

function getSpecialOffersDbPath(): string {
  // Similar implementation for special offers
  const SPECIAL_OFFERS_DB_PATH = process.env.SPECIAL_OFFERS_DB_PATH || './data/specialOffers.json';
  // ... same pattern as getDbPath()
}
```

---

## Complete Example: database.ts

Here's a complete example structure you can adapt:

```typescript
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

// Environment variable configuration
const DB_PATH = process.env.DATABASE_PATH || './data/database.json';
const SPECIAL_OFFERS_DB_PATH = process.env.SPECIAL_OFFERS_DB_PATH || './data/specialOffers.json';

// Type definitions
export interface Database {
  activities: Activity[];
  bookings: any[];
  testimonials: Testimonial[];
  menuItems: MenuItem[];
  // ... other fields
}

// Path resolution
function getDbPath(): string {
  let finalPath: string;
  if (DB_PATH.startsWith('./') || DB_PATH.startsWith('../')) {
    finalPath = join(process.cwd(), DB_PATH);
  } else {
    finalPath = DB_PATH;
  }
  
  const dir = dirname(finalPath);
  try {
    mkdirSync(dir, { recursive: true });
  } catch (error) {
    console.warn('[DB] Could not create directory:', error);
  }
  
  return finalPath;
}

// Read with auto-initialization
export function readDatabase(): Database {
  try {
    const dbPath = getDbPath();
    const data = readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Try to initialize from git version
    try {
      const gitDbPath = join(process.cwd(), './data/database.json');
      if (gitDbPath !== DB_PATH && existsSync(gitDbPath)) {
        const gitData = readFileSync(gitDbPath, 'utf-8');
        const db = JSON.parse(gitData);
        try {
          writeDatabase(db);
        } catch (writeError) {
          console.warn('[DB] Could not write to persistent location:', writeError);
        }
        return db;
      }
    } catch (initError) {
      console.warn('[DB] Could not initialize from git:', initError);
    }
    
    // Return defaults
    return {
      activities: [],
      bookings: [],
      testimonials: [],
      menuItems: [],
      openingTimes: null
    };
  }
}

// Write function
export function writeDatabase(data: Database): void {
  const dbPath = getDbPath();
  const dir = dirname(dbPath);
  
  try {
    mkdirSync(dir, { recursive: true });
  } catch (error) {
    // Ignore if directory exists
  }
  
  try {
    const jsonData = JSON.stringify(data, null, 2);
    writeFileSync(dbPath, jsonData, 'utf-8');
  } catch (error) {
    console.error('[DB] Write error:', error);
    throw error;
  }
}

// CRUD operations
export function addBooking(booking: any): void {
  const db = readDatabase();
  db.bookings.push(booking);
  writeDatabase(db);
}

// ... other CRUD functions
```

---

## Testing and Verification

### 1. Local Development Testing

```bash
# Test with relative paths (default)
npm run dev

# Test with absolute paths (simulating Railway)
DATABASE_PATH=/tmp/database.json npm run dev
```

### 2. Railway Deployment Verification

1. **Deploy your application to Railway**
2. **Check Railway logs** for database initialization messages:
   ```
   [DB] Attempting to read database from: /data/database.json
   [DB] Initializing from git version...
   [DB] Successfully initialized database
   ```

3. **Make a change via your admin panel** (e.g., add a booking)
4. **Redeploy** and verify the change persists

### 3. Verify Volume Mount

You can verify the volume is mounted by checking Railway logs or using a health check endpoint:

```typescript
// In a health check or admin endpoint
import { existsSync } from 'fs';

export function checkDatabaseHealth() {
  const dbPath = getDbPath();
  const exists = existsSync(dbPath);
  const isAbsolute = dbPath.startsWith('/');
  
  return {
    path: dbPath,
    exists,
    isAbsolute,
    volumeMounted: isAbsolute && exists
  };
}
```

---

## Best Practices

### 1. Separate Development and Production

- **Development:** Use relative paths (`./data/database.json`)
- **Production:** Use absolute paths (`/data/database.json`) via environment variables

### 2. Git Strategy

- **Commit default/seed data** to git (menu items, static content)
- **Never commit production data** (bookings, user data, etc.)
- Use `.gitignore` if you want to exclude local dev databases:
  ```
  data/database.local.json
  data/*.local.json
  ```

### 3. Backup Strategy

- Regularly backup your Railway volume data
- Consider implementing automated backups via Railway cron jobs or external services
- Export critical data before major deployments

### 4. Error Handling

- Always handle cases where the volume might not be mounted (during build)
- Log errors clearly for debugging
- Provide fallback defaults when initialization fails

### 5. Multiple Environments

If you have staging and production:

```bash
# Staging
DATABASE_PATH=/data/database.staging.json

# Production
DATABASE_PATH=/data/database.prod.json
```

---

## Troubleshooting

### Issue: Database not persisting after deployment

**Solutions:**
1. Verify the volume is created and mounted in Railway
2. Check environment variables are set correctly
3. Verify the mount path matches your `DATABASE_PATH` environment variable
4. Check Railway logs for initialization errors

### Issue: "Cannot write to database" errors

**Solutions:**
1. Ensure the volume is mounted before the application starts
2. Check file permissions (Railway volumes should have correct permissions by default)
3. Verify the directory path exists (the code creates it automatically)

### Issue: Database resets to git version

**Solutions:**
1. Ensure `DATABASE_PATH` is set to an absolute path (`/data/database.json`)
2. Verify the volume mount path matches your environment variable
3. Check that writes are actually going to the volume path, not the git path

### Issue: Volume not accessible during build

**Note:** Volumes are only accessible at runtime, not during build. This is expected behavior. The initialization logic handles this by:
1. Trying to read from the volume path
2. Falling back to git version if not found
3. Copying git version to volume on first read

---

## Migration Checklist

When implementing this on a new site:

- [ ] Create Railway volume with mount path `/data`
- [ ] Set environment variables (`DATABASE_PATH`, etc.)
- [ ] Implement path resolution function
- [ ] Implement read function with auto-initialization
- [ ] Implement write function
- [ ] Update all database CRUD operations
- [ ] Test locally with relative paths
- [ ] Test locally with absolute paths (simulating Railway)
- [ ] Deploy to Railway
- [ ] Verify initialization from logs
- [ ] Make a test change and verify persistence
- [ ] Redeploy and verify data persists

---

## Summary

This implementation provides:
- ✅ **Persistent storage** across Railway deployments
- ✅ **Automatic initialization** from git-tracked defaults
- ✅ **Development/production flexibility** via environment variables
- ✅ **Error handling** for edge cases
- ✅ **Multiple database file support**

The key pattern is:
1. Use environment variables for paths
2. Support both relative (dev) and absolute (production) paths
3. Auto-initialize from git version if persistent file doesn't exist
4. Always ensure directories exist before reading/writing

This pattern can be adapted for any JSON-based database storage on Railway.app.

