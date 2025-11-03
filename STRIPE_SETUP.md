# Stripe Payment Integration Setup

This project uses Stripe for processing payments. Follow these steps to set up Stripe:

## 1. Install Dependencies

```bash
npm install stripe
```

## 2. Get Your Stripe API Keys

1. Sign up for a Stripe account at https://stripe.com
2. Go to the [Stripe Dashboard](https://dashboard.stripe.com)
3. Navigate to **Developers** > **API keys**
4. Copy your **Publishable key** (starts with `pk_test_` for test mode)
5. Copy your **Secret key** (starts with `sk_test_` for test mode - keep this secure!)

## 3. Set Up Webhook (Optional but Recommended)

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe-webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)

## 4. Configure Environment Variables

Create a `.env` file in the root directory with:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Admin Password
ADMIN_PASSWORD=your_admin_password_here

# Database Path (optional)
DATABASE_PATH=./data/database.json
```

**Important Notes:**
- `PUBLIC_STRIPE_PUBLISHABLE_KEY` is prefixed with `PUBLIC_` because it's used on the client-side
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are server-side only and should never be exposed
- Replace `your_stripe_secret_key_here` with your actual Stripe keys
- For production, use live keys (starting with `pk_live_` and `sk_live_`)

## 5. Test the Integration

1. Use Stripe's test card: `4242 4242 4242 4242`
2. Use any future expiry date (e.g., 12/34)
3. Use any 3-digit CVC (e.g., 123)
4. Use any postal code

## Payment Flow

1. User adds activities to cart
2. User proceeds to checkout and enters contact details
3. User is redirected to payment page
4. Stripe Elements form loads (handles card input securely)
5. User submits payment
6. Payment is processed via Stripe
7. On success, user is redirected to confirmation page
8. Webhook receives payment confirmation (optional)

## Troubleshooting

- **"Stripe publishable key not found"**: Make sure `PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- **"Failed to create payment intent"**: Check that `STRIPE_SECRET_KEY` is correct
- **Webhook not working**: Ensure the webhook URL is correct and accessible from the internet (use ngrok for local testing)

