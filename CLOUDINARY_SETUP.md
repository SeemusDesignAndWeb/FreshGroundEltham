# Cloudinary Setup for Image Uploads

## Overview

This application uses Cloudinary for image uploads. Cloudinary is a cloud-based image and video management service that provides:

- ✅ Unlimited storage (on paid plans)
- ✅ Automatic image optimization
- ✅ Fast CDN delivery worldwide
- ✅ Image transformations on-the-fly
- ✅ Works seamlessly with adapter-node deployment
- ✅ No server storage required

## Getting Started

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (includes 25 GB storage and 25 GB bandwidth/month)
3. Verify your email address

### 2. Get Your API Credentials

1. Log into your Cloudinary dashboard: [https://console.cloudinary.com/](https://console.cloudinary.com/)
2. On the dashboard homepage, you'll see your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "Reveal" to see it)

### 3. Configure Environment Variables

Add these to your `.env` file (create one if it doesn't exist):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Important**: Never commit your `.env` file to git! It's already in `.gitignore`.

### 4. Configure Production Environment

For your production/development server, add the same environment variables:

#### If using PM2 or command line:
```bash
export CLOUDINARY_CLOUD_NAME=your_cloud_name_here
export CLOUDINARY_API_KEY=your_api_key_here
export CLOUDINARY_API_SECRET=your_api_secret_here
```

#### If using a hosting platform (Vercel, Netlify, etc.):
Add these as environment variables in your platform's dashboard.

## How It Works

### Upload Flow

1. Admin uploads an image through `/admin/images`
2. The image is sent to `/api/admin/images/upload`
3. Server converts the image to base64 and uploads to Cloudinary
4. Cloudinary stores the image and returns a URL
5. The URL (e.g., `https://res.cloudinary.com/your-cloud/image/upload/v123456/freshground/image.jpg`) is stored in your database
6. Images are served directly from Cloudinary's CDN

### Folder Structure

All uploaded images are stored in a `freshground/` folder in your Cloudinary account. This helps organize your images if you use Cloudinary for multiple projects.

## Image Management

### Viewing Images

1. Go to your Cloudinary dashboard
2. Click "Media Library" in the left sidebar
3. Navigate to the "freshground" folder to see all uploaded images

### Deleting Images

**Note**: Currently, deleting an image from the admin panel only removes it from your database, not from Cloudinary.

To delete images from Cloudinary:
1. Go to Media Library in Cloudinary dashboard
2. Select the image(s)
3. Click "Delete"

**Future Enhancement**: Add automatic Cloudinary deletion when images are removed from the database.

### Image Transformations

Cloudinary allows you to transform images on-the-fly by modifying the URL. For example:

Original:
```
https://res.cloudinary.com/demo/image/upload/sample.jpg
```

Resized to 300px width:
```
https://res.cloudinary.com/demo/image/upload/w_300/sample.jpg
```

Thumbnail (200x200, cropped):
```
https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg
```

Learn more: [https://cloudinary.com/documentation/image_transformations](https://cloudinary.com/documentation/image_transformations)

## Troubleshooting

### "Failed to upload image to Cloudinary"

**Common Causes:**

1. **Missing or incorrect credentials**
   - Verify your `.env` file has all three variables
   - Check for typos in your credentials
   - Make sure there are no quotes around the values

2. **API Secret not revealed**
   - In Cloudinary dashboard, click "Reveal" next to API Secret
   - Copy the full secret (it's long!)

3. **Cloudinary account issues**
   - Verify your email address
   - Check if you've exceeded free tier limits

4. **Server can't reach Cloudinary**
   - Check your server's internet connection
   - Verify firewall isn't blocking outbound HTTPS requests

### Check Server Logs

The upload endpoint logs detailed information. Check your server logs:

```bash
# If using PM2
pm2 logs

# If using node directly
# Logs will appear in your terminal
```

Look for:
- "Uploading to Cloudinary:" - Shows the file being uploaded
- "Cloudinary upload successful:" - Confirms upload worked
- "Cloudinary upload error:" - Shows any errors

### Test Your Credentials

You can test your Cloudinary credentials with this Node.js script:

```javascript
// test-cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

// Upload a test image
cloudinary.uploader.upload('https://via.placeholder.com/150', {
  public_id: 'test_upload',
  folder: 'freshground'
})
.then(result => {
  console.log('✅ Success!', result.secure_url);
})
.catch(error => {
  console.error('❌ Error:', error.message);
});
```

Run it:
```bash
node test-cloudinary.js
```

## Migration from Local Storage

If you previously had images in `static/images/` or `uploads/`:

1. **Keep existing images** - They'll continue to work from the static folder
2. **New uploads go to Cloudinary** - All future uploads will use Cloudinary
3. **Optional**: Manually upload old images to Cloudinary if needed:
   - Go to Cloudinary Media Library
   - Click "Upload"
   - Select your local images
   - Update paths in your database to use new Cloudinary URLs

## Costs

### Free Tier
- 25 GB storage
- 25 GB bandwidth per month
- 25 transformation credits per month

This is usually sufficient for small to medium websites.

### Paid Plans
If you exceed free tier limits, Cloudinary has affordable paid plans starting around $99/month.

Monitor usage: [https://console.cloudinary.com/settings/usage](https://console.cloudinary.com/settings/usage)

## Security

- ✅ API credentials are stored in `.env` (not in git)
- ✅ Upload endpoint requires admin authentication
- ✅ File type validation (only images allowed)
- ✅ File size limit (10 MB max)
- ✅ Sanitized filenames prevent path traversal

## Resources

- Cloudinary Dashboard: [https://console.cloudinary.com/](https://console.cloudinary.com/)
- Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Node.js SDK: [https://cloudinary.com/documentation/node_integration](https://cloudinary.com/documentation/node_integration)
- Support: [https://support.cloudinary.com/](https://support.cloudinary.com/)

