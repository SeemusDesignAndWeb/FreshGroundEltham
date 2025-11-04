# Resend Email Setup

This project uses Resend for sending contact form emails and booking confirmations. Resend is a modern email API that's simple, reliable, and developer-friendly.

## 1. Install Dependencies

```bash
npm install resend
```

## 2. Create a Resend Account

1. Sign up for a free Resend account at https://resend.com
2. Verify your email address
3. Complete the account setup process

## 3. Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Name it (e.g., "Fresh Ground Eltham Website")
5. Select permissions (at minimum: **Sending access**)
6. Click **Create**
7. **Important**: Copy the API key immediately - you can see it again but it's good practice to save it

## 4. Verify Your Domain

1. Go to **Domains** in the Resend dashboard
2. Click **Add Domain**
3. Enter your domain: `freshgroundeltham.co.uk`
4. Follow the DNS setup instructions:
   - Add the provided DNS records to your domain's DNS settings
   - Wait for verification (usually takes a few minutes to 24 hours)
5. Once verified, you can send emails from `coffeehouse@freshgroundeltham.co.uk`

### Alternative: Use Resend's Test Domain (Quick Setup)

For testing, you can use Resend's test domain:
- From: `onboarding@resend.dev`
- This works immediately but emails may be marked as test/development

## 5. Configure Environment Variables

Add the following to your `.env` file:

```env
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=Fresh Ground Eltham <coffeehouse@freshgroundeltham.co.uk>
```

**Important Notes:**
- Replace `your_api_key_here` with your actual Resend API key (starts with `re_`)
- The `RESEND_FROM_EMAIL` format is: `Name <email@domain.com>`
- The email domain must be verified in Resend
- Never commit your `.env` file to version control

## 6. Test the Integration

1. Start your development server
2. Go to the contact page
3. Fill out and submit the contact form
4. Check that:
   - You receive an email at `coffeehouse@freshgroundeltham.co.uk`
   - The user receives a confirmation email

## Email Features

The contact form will:
- Send an email to `coffeehouse@freshgroundeltham.co.uk` with the form submission
- Send a confirmation email to the user
- Include all form fields (name, email, phone, subject, message)
- Handle errors gracefully with user-friendly messages

## Troubleshooting

- **"Email service is not configured"**: Make sure `RESEND_API_KEY` is set in `.env` and restart your server
- **"Failed to send message"**: 
  - Check that your API key is correct
  - Verify your domain is authenticated in Resend
  - Check Resend dashboard for any errors or account issues
- **Emails not received**: 
  - Check spam/junk folders
  - Verify domain authentication is complete
  - Check Resend dashboard activity/logs for delivery status
  - Ensure you're using a verified domain (not the test domain in production)

## Free Tier Limits

Resend's free tier includes:
- 100 emails per day
- 3,000 emails per month
- Full access to all features
- Perfect for small businesses and community organizations

## Production Checklist

Before going live:
- [ ] Complete domain verification in Resend
- [ ] Set up SPF, DKIM, and DMARC records (automatically configured by Resend)
- [ ] Test email delivery to multiple email providers
- [ ] Monitor Resend dashboard for delivery issues
- [ ] Consider upgrading if you expect more than 100 emails/day

## Why Resend?

- **Simple API**: Easy to use and integrate
- **Great Developer Experience**: Excellent documentation and dashboard
- **Reliable**: Built on modern infrastructure
- **Free Tier**: Generous free tier for getting started
- **Fast Setup**: Can be configured in minutes

