# Cloudinary Migration - Changes Made

## Summary

The image upload system has been migrated from local file storage to **Cloudinary** cloud storage. This resolves issues with image uploads on the development/production server where the `static/` folder is read-only when using `@sveltejs/adapter-node`.

## Changes Made

### 1. Installed Cloudinary SDK

```bash
npm install cloudinary
```

Added `cloudinary` package to `dependencies` in `package.json`.

### 2. Updated Upload Endpoint

**File**: `src/routes/api/admin/images/upload/+server.ts`

- Replaced local filesystem writes with Cloudinary API uploads
- Images are now uploaded to Cloudinary and stored in the `freshground/` folder
- Returns Cloudinary CDN URLs (e.g., `https://res.cloudinary.com/...`)
- Added detailed logging for debugging

**Key Changes**:
- Imports Cloudinary SDK and configuration from environment variables
- Converts uploaded file to base64 data URI
- Uploads to Cloudinary with sanitized filenames
- Returns secure Cloudinary URL for storage in database

### 3. Created Documentation

**File**: `CLOUDINARY_SETUP.md`

Comprehensive guide covering:
- Getting started with Cloudinary
- How to get API credentials
- Environment variable configuration
- How the upload system works
- Image management in Cloudinary dashboard
- Troubleshooting common issues
- Migration from local storage
- Costs and free tier limits

### 4. Updated README

**File**: `README.md`

- Complete rewrite with Fresh Ground Eltham branding
- Added Cloudinary setup instructions
- Documented all features and services
- Added project structure and deployment info

## Required Action: Add Environment Variables

You need to add these three environment variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**How to get these credentials:**

1. Create a free Cloudinary account at [https://cloudinary.com](https://cloudinary.com)
2. Log into the dashboard at [https://console.cloudinary.com/](https://console.cloudinary.com/)
3. On the homepage, you'll see all three credentials
4. Click "Reveal" to see the API Secret

See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for detailed instructions.

## Testing

After adding the environment variables:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Login to admin**:
   Navigate to `http://localhost:5173/admin/login`

3. **Go to Images page**:
   Click "Images" in the admin sidebar

4. **Upload a test image**:
   - Click "Add New Image"
   - Choose an image file
   - The file should upload to Cloudinary
   - You'll see the Cloudinary URL in the "path" field

5. **Verify in Cloudinary**:
   - Go to your Cloudinary dashboard
   - Click "Media Library"
   - You should see your image in the "freshground" folder

## Benefits of Cloudinary

✅ **No server storage issues** - Works perfectly with adapter-node
✅ **CDN delivery** - Images served fast worldwide
✅ **Automatic optimization** - Cloudinary optimizes images
✅ **Image transformations** - Resize/crop on-the-fly via URL
✅ **Scalable** - No disk space limits on your server
✅ **Backup included** - Images stored safely in the cloud

## Production Deployment

For your production server:

1. Add the same three Cloudinary environment variables to your production `.env` file or hosting platform
2. Rebuild and deploy your application
3. Image uploads will now work seamlessly

## Troubleshooting

If uploads don't work:

1. **Check environment variables**:
   - Make sure all three Cloudinary variables are set
   - No typos in variable names or values
   - No quotes around values in `.env`

2. **Check server logs**:
   - Look for "Uploading to Cloudinary:" messages
   - Check for any error messages
   - Verify credentials are being loaded

3. **Test credentials**:
   - See test script in CLOUDINARY_SETUP.md
   - Verifies your credentials work

4. **Check Cloudinary account**:
   - Email verified?
   - Within free tier limits?
   - API access enabled?

See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for more detailed troubleshooting.

## Future Enhancements

Potential improvements:

- [ ] Auto-delete from Cloudinary when image removed from database
- [ ] Image transformation helpers (automatic resizing)
- [ ] Bulk upload from local images
- [ ] Image optimization settings
- [ ] Multiple folder support for different image types

## Rollback

If you need to rollback to local storage (not recommended):

The previous version using local filesystem is in git history. However, this won't solve the production upload issue - Cloudinary is the correct solution for adapter-node deployments.

## Questions?

See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for detailed documentation.

