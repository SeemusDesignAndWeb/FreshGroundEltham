# Deployment Workflow

## Development to Production Workflow

This project uses a single database file (`data/database.json`) that is tracked in git and synced between development and production.

### Making Changes

1. **Make changes in development** (local or dev server)
   - Add/edit menu items via Admin > Menu
   - Add/edit activities via Admin > Activities
   - Upload images via Admin > Images
   - Update settings via Admin

2. **Commit and push changes**
   ```bash
   git add data/database.json
   git commit -m "Update menu items / activities / etc."
   git push
   ```

3. **Deploy to production**
   - Pull the latest changes on your production server
   - Or redeploy if using a platform like Vercel/Netlify (they'll auto-deploy on push)

### What Gets Synced

- ✅ Menu items
- ✅ Activities (kids activities)
- ✅ Testimonials
- ✅ Opening times
- ✅ Banner settings
- ✅ Activities settings
- ✅ Image library entries
- ✅ Static images (in `static/images/`)

### Important Notes

- **Database file is now tracked in git** - This ensures all CMS content is deployed
- **Images are tracked in git** - All images in `static/images/` are committed
- **Environment variables** (`.env`) are NOT in git - Configure these separately in production
- **Bookings** are stored in the database but won't sync (this is intentional for privacy)

### Future: Separate Dev/Prod Databases

If you later need separate databases for dev and production, you can:
1. Add `data/database.json` back to `.gitignore`
2. Use `DATABASE_PATH` environment variable:
   - Dev: `DATABASE_PATH=./data/database.dev.json`
   - Prod: `DATABASE_PATH=./data/database.prod.json`

