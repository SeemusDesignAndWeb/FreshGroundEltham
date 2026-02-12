import { json } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

// Get PayPal access token
async function getAccessToken() {
	// Trim whitespace from credentials (common issue with .env files)
	const PAYPAL_CLIENT_ID = env.PAYPAL_CLIENT_ID?.trim();
	const PAYPAL_CLIENT_SECRET = env.PAYPAL_CLIENT_SECRET?.trim();
	const PAYPAL_BASE_URL = (env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com').trim();

	if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
		throw new Error('PayPal credentials not configured');
	}

	// Validate credential format
	if (!PAYPAL_CLIENT_ID.startsWith('A') && !PAYPAL_CLIENT_ID.startsWith('AQ')) {
		console.warn('PayPal Client ID format may be incorrect (should start with A or AQ)');
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
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.error_description || errorData.error || 'Failed to get PayPal access token';
		
		// Log additional debug info (without exposing secrets)
		console.error('PayPal auth error details:', {
			status: response.status,
			statusText: response.statusText,
			baseUrl: PAYPAL_BASE_URL,
			clientIdLength: PAYPAL_CLIENT_ID?.length || 0,
			secretLength: PAYPAL_CLIENT_SECRET?.length || 0,
			error: errorData
		});
		
		throw new Error(`PayPal authentication failed: ${errorMessage}`);
	}

	const data = await response.json();
	return data.access_token;
}

export const POST= async ({ request }) => {
	// Trim whitespace from credentials (common issue with .env files)
	const PAYPAL_CLIENT_ID = env.PAYPAL_CLIENT_ID?.trim();
	const PAYPAL_CLIENT_SECRET = env.PAYPAL_CLIENT_SECRET?.trim();
	const PAYPAL_BASE_URL = (env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com').trim();

	if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
		return json(
			{ error: 'PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in environment variables.' },
			{ status: 500 }
		);
	}

	try {
		const { amount, bookingData } = await request.json();

		// Get access token
		const accessToken = await getAccessToken();

		// Create PayPal order
		const orderData = {
			intent: 'CAPTURE',
			purchase_units: [{
				amount: {
					currency_code: 'GBP',
					value: amount.toFixed(2)
				},
				description: 'Activity Booking'
			}],
			application_context: {
				return_url: `${request.headers.get('origin') || ''}/booking-confirmation`,
				cancel_url: `${request.headers.get('origin') || ''}/payment`,
				brand_name: 'Fresh Ground Eltham',
				user_action: 'PAY_NOW',
				locale: 'en-GB'
			}
		};

		const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			},
			body: JSON.stringify(orderData)
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			const errorDetails = error.details?.[0]?.description || error.message || error.name || 'Failed to create PayPal order';
			throw new Error(`PayPal order creation failed: ${errorDetails}`);
		}

		const order = await response.json();

		// Store booking data in session (we'll need to handle this differently)
		// For now, we'll return the order ID and the client can store booking data
		// Note: PAYPAL_CLIENT_ID needs to be public for client-side use
		return json({
			orderId: order.id,
			clientId: PAYPAL_CLIENT_ID
		});
	} catch (error) {
		console.error('Error creating PayPal order:', error);
		return json(
			{
				error: error.message || 'Failed to create payment order'
			},
			{ status: 500 }
		);
	}
};

