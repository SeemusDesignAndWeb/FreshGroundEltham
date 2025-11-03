import { json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/stripe';

// This is your Stripe webhook secret (set in .env)
const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

export const POST: RequestHandler = async ({ request }) => {
	if (!stripe) {
		return json({ error: 'Stripe is not configured' }, { status: 500 });
	}

	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature || !webhookSecret) {
		return json({ error: 'Missing signature or webhook secret' }, { status: 400 });
	}

	let event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err: any) {
		console.error('Webhook signature verification failed:', err.message);
		return json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
	}

	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object as any;
			console.log('PaymentIntent succeeded:', paymentIntent.id);
			
			// Here you would:
			// 1. Extract booking data from metadata
			// 2. Save booking to database
			// 3. Send confirmation email
			// 4. Clear cart
			
			const bookingData = paymentIntent.metadata?.bookingData 
				? JSON.parse(paymentIntent.metadata.bookingData)
				: null;
			
			if (bookingData) {
				// TODO: Save booking to database
				console.log('Booking confirmed:', bookingData);
			}
			break;
		
		case 'payment_intent.payment_failed':
			const failedPayment = event.data.object as any;
			console.log('PaymentIntent failed:', failedPayment.id);
			break;
		
		default:
			console.log(`Unhandled event type: ${event.type}`);
	}

	return json({ received: true });
};

