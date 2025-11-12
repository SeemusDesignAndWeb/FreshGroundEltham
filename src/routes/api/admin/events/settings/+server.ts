import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEventsSettings, updateEventsSettings } from '$lib/server/database';
import type { EventsSettings } from '$lib/server/database';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const settings = getEventsSettings();
		return json({ settings });
	} catch (error) {
		console.error('Error fetching events settings:', error);
		return json({ error: 'Failed to fetch events settings' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	// Check authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const settings: EventsSettings = await request.json();
		updateEventsSettings(settings);
		return json({ success: true, settings });
	} catch (error) {
		console.error('Error updating events settings:', error);
		return json({ error: 'Failed to update events settings' }, { status: 500 });
	}
};

