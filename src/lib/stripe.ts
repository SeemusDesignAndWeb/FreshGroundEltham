import Stripe from 'stripe';

const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
	console.warn('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = stripeSecretKey 
	? new Stripe(stripeSecretKey, {
			apiVersion: '2024-12-18.acacia',
			typescript: true
		})
	: null;
