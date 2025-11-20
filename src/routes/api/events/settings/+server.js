import { json } from '@sveltejs/kit';

import { getEventsSettings } from '$lib/server/database';

export const GET= async () => {
	try {
		const settings = getEventsSettings();
		return json({ settings });
	} catch (error) {
		console.error('Error fetching events settings:', error);
		return json({ error: 'Failed to fetch events settings' }, { status: 500 });
	}
};

