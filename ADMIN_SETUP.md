# Admin Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
ADMIN_PASSWORD=your_secure_password_here
DATABASE_PATH=./data/database.json
```

**Important:** 
- Change `ADMIN_PASSWORD` to a strong password
- Never commit the `.env` file to version control (it's already in `.gitignore`)
- The default password is `changeme123` - **change this immediately**

## Database

The application uses a JSON file database located at `data/database.json`. This file contains:
- Activities (kids activities)
- Bookings (future: store booking confirmations)

The database file is automatically created if it doesn't exist.

## Admin Access

1. Navigate to `/admin/login`
2. Enter the admin password (from `.env` file)
3. You'll be redirected to `/admin` where you can:
   - Add new activities
   - Edit existing activities
   - Delete activities

## Logging Out

Click the "Logout" button in the admin area, or delete the `admin_session` cookie.

## Security Notes

- The admin session expires after 24 hours
- Sessions are stored in httpOnly cookies
- The admin area is protected by server-side authentication
- Always use a strong password in production

