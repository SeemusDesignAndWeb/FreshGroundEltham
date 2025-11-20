import { json } from '@sveltejs/kit';

import { getGallerySettings, updateGallerySettings } from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	const settings = getGallerySettings();
	return json(settings);
};

export const POST= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	try {
		const settings = await request.json();
		updateGallerySettings(settings);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};

