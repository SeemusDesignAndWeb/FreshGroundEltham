import { json } from '@sveltejs/kit';

import { 
	getOpeningTimes, 
	updateOpeningTimes 
} from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const openingTimes = getOpeningTimes();
	return json({ openingTimes });
};

export const PUT= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const openingTimes= await request.json();
		updateOpeningTimes(openingTimes);
		return json({ success: true, openingTimes });
	} catch (error) {
		return json({ error: 'Failed to update opening times' }, { status: 500 });
	}
};

