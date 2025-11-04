import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Get PayPal access token
async function getAccessToken(): Promise<string> {
	// Trim whitespace from credentials (common issue with .env files)
	const PAYPAL_CLIENT_ID = env.PAYPAL_CLIENT_ID?.trim();
	const PAYPAL_CLIENT_SECRET = env.PAYPAL_CLIENT_SECRET?.trim();
	const PAYPAL_BASE_URL = (env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com').trim();

	if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
		throw new Error('PayPal credentials not configured');
	}

	const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
	
	const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${auth}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'grant_type=client_credentials'
	});

	if (!response.ok) {
		throw new Error('Failed to get PayPal access token');
	}

	const data = await response.json();
	return data.access_token;
}

export const POST: RequestHandler = async ({ request }) => {
	// Trim whitespace from credentials (common issue with .env files)
	const PAYPAL_CLIENT_ID = env.PAYPAL_CLIENT_ID?.trim();
	const PAYPAL_CLIENT_SECRET = env.PAYPAL_CLIENT_SECRET?.trim();
	const PAYPAL_BASE_URL = (env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com').trim();

	if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
		return json(
			{ error: 'PayPal is not configured' },
			{ status: 500 }
		);
	}

	try {
		const { orderId } = await request.json();

		if (!orderId) {
			return json({ error: 'Order ID is required' }, { status: 400 });
		}

		// Get access token
		const accessToken = await getAccessToken();

		// Capture the payment
		const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			}
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || 'Failed to capture payment');
		}

		const captureData = await response.json();

		return json({
			success: true,
			orderId: captureData.id,
			status: captureData.status,
			payer: captureData.payer,
			purchase_units: captureData.purchase_units
		});
	} catch (error: any) {
		console.error('Error capturing PayPal payment:', error);
		return json(
			{
				error: error.message || 'Failed to capture payment'
			},
			{ status: 500 }
		);
	}
};

