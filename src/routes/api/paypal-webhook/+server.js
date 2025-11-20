import { json } from '@sveltejs/kit';

// PayPal webhook handler
// Note: PayPal webhooks require verification using PayPal's webhook verification API
const PAYPAL_WEBHOOK_ID = import.meta.env.PAYPAL_WEBHOOK_ID;

export const POST= async ({ request }) => {
	try {
		const body = await request.json();
		
		// Verify webhook signature (simplified - in production, verify with PayPal)
		// PayPal webhook verification should be done using PayPal's webhook verification API
		
		const eventType = body.event_type;
		const resource = body.resource;

		// Handle different PayPal webhook events
		switch (eventType) {
			case 'PAYMENT.CAPTURE.COMPLETED':
				console.log('Payment captured:', resource.id);
				
				// Extract booking data from custom_id or metadata if stored
				const bookingData = resource.custom_id 
					? JSON.parse(resource.custom_id)
					: null;
				
				if (bookingData) {
					// TODO: Save booking to database
					console.log('Booking confirmed:', bookingData);
				}
				break;
			
			case 'PAYMENT.CAPTURE.DENIED':
				console.log('Payment denied:', resource.id);
				break;
			
			case 'CHECKOUT.ORDER.COMPLETED':
				console.log('Order completed:', resource.id);
				break;
			
			default:
				console.log(`Unhandled event type: {eventType}`);
		}

		return json({ received: true });
	} catch (error) {
		console.error('Webhook error:', error);
		return json({ error: 'Webhook processing failed' }, { status: 400 });
	}
};

