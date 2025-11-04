# PayPal Payment Integration Setup

This project uses PayPal for processing credit card and PayPal account payments. Follow these steps to set up PayPal:

## 1. Install Dependencies

```bash
npm install @paypal/paypal-js
```

## 2. Get Your PayPal API Credentials

1. Sign up for a PayPal Business account at https://www.paypal.com/business
2. Go to the [PayPal Developer Dashboard](https://developer.paypal.com)
3. Navigate to **My Apps & Credentials**
4. Create a new app or use an existing one
5. Copy your **Client ID** and **Secret** (for sandbox/test mode)
6. For production, switch to **Live** mode and use live credentials

## 3. Set Up Webhook (Optional but Recommended)

1. In PayPal Developer Dashboard, go to **My Apps & Credentials**
2. Click on your app
3. Scroll down to **Webhooks** section
4. Click **Add Webhook**
5. Set the webhook URL to: `https://yourdomain.com/api/paypal-webhook`
6. Select events to listen to:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `CHECKOUT.ORDER.COMPLETED`
7. Copy the **Webhook ID**

## 4. Configure Environment Variables

Create a `.env` file in the root directory with:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_key_here
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_WEBHOOK_ID=your_webhook_id_here

# For production, use:
# PAYPAL_BASE_URL=https://api-m.paypal.com

# Admin Password
ADMIN_PASSWORD=your_admin_password_here

# Database Path (optional)
DATABASE_PATH=./data/database.json
```

**Important Notes:**
- `PAYPAL_CLIENT_ID` is used on the client-side (exposed in browser)
- `PAYPAL_CLIENT_SECRET` and `PAYPAL_WEBHOOK_ID` are server-side only and should never be exposed
- Replace `your_paypal_client_id_here` with your actual PayPal credentials
- For production, use live credentials (different from sandbox)
- Use `https://api-m.paypal.com` for production base URL

## 5. Test the Integration

### Sandbox Test Accounts

PayPal provides sandbox test accounts for testing:

1. Go to [PayPal Sandbox](https://developer.paypal.com/dashboard/accounts)
2. Create test buyer and seller accounts
3. Use test buyer account credentials to test payments

### Test Cards

For credit card testing in sandbox mode, you can use:
- Card Number: `4111111111111111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- ZIP: Any valid ZIP code

## Payment Flow

1. User adds activities to cart
2. User proceeds to checkout and enters contact details
3. User is redirected to payment page
4. PayPal payment buttons load (supports PayPal account and credit/debit cards)
5. User completes payment through PayPal
6. Payment is captured on the server
7. User is redirected to booking confirmation page

## Troubleshooting

- **"PayPal client ID not found"**: Make sure `PAYPAL_CLIENT_ID` is set in `.env`
- **"Failed to create payment order"**: Check that `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are correct
- **"Failed to get PayPal access token"**: Verify your credentials are valid and the base URL matches your environment (sandbox vs live)
- **Payment buttons don't load**: Check browser console for errors and verify `PAYPAL_CLIENT_ID` is accessible

## Production Checklist

Before going live:
- [ ] Switch to live credentials in `.env`
- [ ] Update `PAYPAL_BASE_URL` to `https://api-m.paypal.com`
- [ ] Set up production webhook endpoint
- [ ] Test complete payment flow with real PayPal account
- [ ] Test credit card payment flow
- [ ] Verify webhook events are being received
- [ ] Set up proper error logging and monitoring

