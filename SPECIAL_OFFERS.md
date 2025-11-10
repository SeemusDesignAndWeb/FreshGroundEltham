# Special Offers Feature

This document explains the new Special Offers feature that has been added to Fresh Ground Eltham.

## Overview

Special offers are promotional items that appear on the home page below the hero slider. They work similarly to activities but are designed for one-time purchases rather than date-specific bookings.

## Features

- **Separate Database**: Special offers are stored in a separate `data/specialOffers.json` file to avoid conflicts with your main database
- **Admin Management**: Full CRUD (Create, Read, Update, Delete) functionality through the admin panel
- **Shopping Cart Integration**: Special offers can be added to cart alongside activities
- **Enable/Disable**: Toggle whether an offer is displayed on the homepage
- **Email Information**: Optional field for additional customer information sent via email only

## File Structure

### Database
- `data/specialOffers.json` - Stores all special offers data

### Backend (API)
- `src/routes/api/special-offers/+server.ts` - Public API for fetching enabled offers
- `src/routes/api/admin/special-offers/+server.ts` - Admin API for managing offers
- `src/lib/server/database.ts` - Updated with special offer functions

### Frontend
- `src/routes/+page.svelte` - Home page displays special offers
- `src/routes/admin/special-offers/+page.svelte` - Admin page for managing offers
- `src/routes/admin/special-offers/+page.ts` - Route protection
- `src/routes/admin/+page.svelte` - Updated dashboard with special offers link
- `src/routes/cart/+page.svelte` - Updated to handle both activities and special offers
- `src/lib/stores/cart.ts` - Updated cart store to support both types

## How to Use

### Creating a Special Offer (Admin)

1. Navigate to `/admin` and log in
2. Click on the "Special Offers" card
3. Click "+ Add Special Offer"
4. Fill in the form:
   - **Offer Name**: e.g., "Coffee & Cake Deal"
   - **Price**: The promotional price in GBP
   - **Description**: What's included in the offer
   - **Image**: Select from your image library
   - **Display on homepage**: Toggle to show/hide
   - **Email Information** (Optional): Additional details for customer emails
5. Click "Create Offer"

### Managing Special Offers

- **Edit**: Click the "Edit" button on any offer to modify it
- **Delete**: Click the "Delete" button to remove an offer
- **Enable/Disable**: Use the checkbox when editing to show/hide offers

### Customer Experience

1. Customers see enabled special offers on the home page below the hero slider
2. Each offer displays:
   - Special Offer badge
   - Offer name
   - Description
   - Price
   - "Buy Now" button
3. Clicking "Buy Now" adds the offer to cart and navigates to the cart page
4. In the cart, special offers are distinguished from activities with a badge
5. The checkout process works the same as for activities

## Data Structure

### SpecialOffer Interface

```typescript
{
  id: string;              // Unique identifier
  name: string;            // Offer name
  description: string;     // Offer description
  price: number;          // Price in GBP
  image: string;          // Image path/URL
  enabled: boolean;       // Whether to display
  emailInformation?: string; // Optional email-only info
}
```

### Cart Item Types

Cart items now have a `type` field:
- `'activity'` - Date/time specific bookings
- `'special-offer'` - One-time purchases

## Environment Variables

You can optionally set a custom path for the special offers database:

```bash
SPECIAL_OFFERS_DB_PATH=./data/specialOffers.json
```

## API Endpoints

### Public API
- `GET /api/special-offers` - Returns all enabled special offers

### Admin API (requires authentication)
- `GET /api/admin/special-offers` - Returns all special offers (including disabled)
- `POST /api/admin/special-offers` - Create, update, or delete offers
  - Actions: `create`, `update`, `delete`

## Design

The special offers section features:
- Gradient background (from teal to terracotta)
- Special Offer badge in terracotta color (#ab6b51)
- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- Hover effects and animations
- Gradient "Buy Now" button

## Notes

- Special offers do not have date/time fields (unlike activities)
- The separate database prevents accidental overwrites during deployment
- Email information is never displayed on the website, only sent to customers
- Images must be added to the image library before they can be used for offers

