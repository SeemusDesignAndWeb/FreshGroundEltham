import { json } from '@sveltejs/kit';

import { getPageBackgroundImages, updatePageBackgroundImages } from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	const backgrounds = getPageBackgroundImages();
	return json({ backgrounds });
};

export const POST= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	try {
		const backgrounds = await request.json();
		updatePageBackgroundImages(backgrounds);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};

