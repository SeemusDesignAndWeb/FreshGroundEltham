import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/stripe';

export const POST: RequestHandler = async ({ request }) => {
	if (!stripe) {
		return json(
			{ error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.' },
			{ status: 500 }
		);
	}

	try {
		const { amount, bookingData } = await request.json();

		// Convert amount from pounds to pence (Stripe uses smallest currency unit)
		const amountInPence = Math.round(amount * 100);

		// Create a PaymentIntent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amountInPence,
			currency: 'gbp',
			metadata: {
				bookingData: JSON.stringify(bookingData)
			},
			automatic_payment_methods: {
				enabled: true
			}
		});

		return json({
			clientSecret: paymentIntent.client_secret
		});
	} catch (error: any) {
		console.error('Error creating payment intent:', error);
		return json(
			{
				error: error.message || 'Failed to create payment intent'
			},
			{ status: 500 }
		);
	}
};

