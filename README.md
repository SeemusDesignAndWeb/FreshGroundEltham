---
title: SvelteKit
description: A simple SvelteKit app
tags:
  - svelte
  - typescript
  - tailwind
---

# Fresh Ground Eltham

A modern website for Fresh Ground Eltham cafe with integrated CMS, booking system, and payment processing.

## ✨ Features

- **SvelteKit 5** - Modern reactive framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Beautiful, responsive design
- **Admin CMS** - Manage menu, activities, images, and content
- **Booking System** - Online activity bookings with calendar
- **Payment Integration** - PayPal and Stripe support
- **Email Notifications** - Resend integration for contact forms and bookings
- **Image Management** - Cloudinary integration for uploads
- **SEO Optimized** - Meta tags, structured data, and sitemaps

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Access
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_TO_EMAIL=contact@yourdomain.com

# Payment (PayPal)
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id
PAYPAL_MODE=sandbox
```

See setup guides for each service:
- **Cloudinary**: [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)
- **Resend**: [RESEND_SETUP.md](./RESEND_SETUP.md)
- **PayPal**: [PAYPAL_SETUP.md](./PAYPAL_SETUP.md)
- **Admin**: [ADMIN_SETUP.md](./ADMIN_SETUP.md)

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 4. Access Admin Panel

Navigate to `/admin/login` and use your configured admin credentials.

## 📚 Documentation

- [Deployment Workflow](./DEPLOYMENT_WORKFLOW.md) - How to deploy changes
- [Cloudinary Setup](./CLOUDINARY_SETUP.md) - Image upload configuration
- [Menu Import Guide](./MENU_IMPORT_GUIDE.md) - Bulk menu imports
- [Admin Setup](./ADMIN_SETUP.md) - Admin panel configuration

## 🏗️ Project Structure

```
├── src/
│   ├── routes/              # Pages and API endpoints
│   │   ├── admin/          # Admin CMS pages
│   │   ├── api/            # API routes
│   │   └── ...             # Public pages
│   ├── lib/
│   │   ├── components/     # Reusable components
│   │   ├── server/         # Server-side code
│   │   └── stores/         # Svelte stores
│   └── app.css            # Global styles
├── static/                 # Static assets
├── data/
│   └── database.json      # JSON database (tracked in git)
└── build/                 # Production build output
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run check` - Type check
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 📦 Deployment

This app uses `@sveltejs/adapter-node` and can be deployed to any Node.js hosting:

```bash
npm run build
npm run start
```

See [DEPLOYMENT_WORKFLOW.md](./DEPLOYMENT_WORKFLOW.md) for detailed deployment instructions.

## 🖼️ Image Management

Images are stored in **Cloudinary** (cloud storage with CDN). This provides:
- Unlimited scalability
- Automatic optimization
- Global CDN delivery
- No server storage management

See [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) for setup instructions.

## 💾 Database

Uses a JSON file database (`data/database.json`) tracked in git. This means all CMS content is version controlled and deployed with your code.

For production with separate databases, see [DEPLOYMENT_WORKFLOW.md](./DEPLOYMENT_WORKFLOW.md).

## 🔐 Security

- Admin routes protected with cookie-based authentication
- File upload validation (type, size)
- Sanitized filenames
- Environment variables for secrets
- HTTPS recommended for production

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

All rights reserved.