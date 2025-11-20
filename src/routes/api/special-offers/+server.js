import { json } from '@sveltejs/kit';
import { getSpecialOffers } from '$lib/server/database';

export const GET= async () => {
	try {
		const offers = getSpecialOffers();
		// Only return enabled offers to the public
		const enabledOffers = offers.filter(offer => offer.enabled);
		return json({ offers: enabledOffers });
	} catch (error) {
		console.error('Error fetching special offers:', error);
		return json({ error: 'Failed to fetch special offers' }, { status: 500 });
	}
};

