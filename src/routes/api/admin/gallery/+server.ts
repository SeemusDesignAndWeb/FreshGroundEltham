import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGallerySettings, updateGallerySettings } from '$lib/server/database';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	const settings = getGallerySettings();
	return json(settings);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
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

