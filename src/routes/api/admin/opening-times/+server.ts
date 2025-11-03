import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { 
	getOpeningTimes, 
	updateOpeningTimes 
} from '$lib/server/database';
import type { OpeningTimes } from '$lib/server/database';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const openingTimes = getOpeningTimes();
	return json({ openingTimes });
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const openingTimes: OpeningTimes = await request.json();
		updateOpeningTimes(openingTimes);
		return json({ success: true, openingTimes });
	} catch (error) {
		return json({ error: 'Failed to update opening times' }, { status: 500 });
	}
};

