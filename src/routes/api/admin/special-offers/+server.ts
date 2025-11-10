import { json } from '@sveltejs/kit';
import { 
	getSpecialOffers, 
	addSpecialOffer, 
	updateSpecialOffer, 
	removeSpecialOffer 
} from '$lib/server/database';
import type { SpecialOffer } from '$lib/server/database';
import type { RequestHandler } from './$types';

// Get all special offers (admin - includes disabled ones)
export const GET: RequestHandler = async ({ cookies }) => {
	// Check authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const offers = getSpecialOffers();
		return json({ offers });
	} catch (error) {
		console.error('Error fetching special offers:', error);
		return json({ error: 'Failed to fetch special offers' }, { status: 500 });
	}
};

// Create or update special offers
export const POST: RequestHandler = async ({ request, cookies }) => {
	// Check authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { action, offer } = await request.json();

		if (action === 'create') {
			// Generate a unique ID for the new offer
			const newOffer: SpecialOffer = {
				...offer,
				id: Date.now().toString()
			};
			addSpecialOffer(newOffer);
			return json({ success: true, offer: newOffer });
		} 
		
		if (action === 'update') {
			updateSpecialOffer(offer.id, offer);
			return json({ success: true });
		}
		
		if (action === 'delete') {
			removeSpecialOffer(offer.id);
			return json({ success: true });
		}

		return json({ error: 'Invalid action' }, { status: 400 });
	} catch (error) {
		console.error('Error managing special offers:', error);
		return json({ error: 'Failed to process request' }, { status: 500 });
	}
};

